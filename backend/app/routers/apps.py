import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from ..cloudinary_utils import delete_image, upload_image
from ..database import get_db
from ..models import AdminUser, App
from ..schemas import AppIn, AppOut
from ..security import get_current_admin

router = APIRouter(tags=["apps"])


async def _parse_app_form(request: Request) -> tuple[AppIn, dict[str, UploadFile]]:
    """Every create/update is multipart: a `data` field carrying the JSON
    payload (existing image slots already have {url, public_id}), plus zero
    or more files attached under `icon` and `screen_{groupIndex}_{imageIndex}`
    for whichever slots are new picks. No separate upload endpoint — this is
    the only place a file for an app is ever accepted."""
    form = await request.form()
    raw = form.get("data")
    if raw is None:
        raise HTTPException(status_code=422, detail="Missing 'data' field")
    payload = AppIn.model_validate(json.loads(raw))
    files = {key: value for key, value in form.multi_items() if isinstance(value, UploadFile)}
    return payload, files


async def _apply_app_uploads(payload: AppIn, files: dict[str, UploadFile], existing: App | None) -> dict:
    icon_url = existing.icon_url if existing else None
    icon_public_id = existing.icon_public_id if existing else None
    if "icon" in files:
        if icon_public_id:
            await delete_image(icon_public_id)
        icon_url, icon_public_id = await upload_image(files["icon"], folder="apps/icons")
    elif payload.icon:
        # A known reference (not a fresh upload) — e.g. mirrored from the
        # other platform's already-uploaded icon. Takes precedence over the
        # existing row so replacing/clearing a mirrored icon actually sticks.
        icon_url, icon_public_id = payload.icon.url, payload.icon.public_id

    screen_groups = []
    for group_index, group in enumerate(payload.screen_groups):
        images = []
        for image_index, image in enumerate(group.images):
            file_key = f"screen_{group_index}_{image_index}"
            if file_key in files:
                url, public_id = await upload_image(files[file_key], folder="apps/screens")
                images.append({"url": url, "public_id": public_id})
            else:
                images.append({"url": image.url, "public_id": image.public_id})
        screen_groups.append({"name": group.name, "images": images})

    return {
        "platform": payload.platform,
        "name": payload.name,
        "icon_url": icon_url,
        "icon_public_id": icon_public_id,
        "screen_groups": screen_groups,
        "sort_order": payload.sort_order,
    }


@router.get("/apps", response_model=list[AppOut])
def list_apps(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    return db.query(App).order_by(App.sort_order, App.created_at).all()


@router.post("/apps", response_model=AppOut, status_code=201)
async def create_app(
    request: Request, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    payload, files = await _parse_app_form(request)
    fields = await _apply_app_uploads(payload, files, existing=None)
    app_row = App(**fields)
    db.add(app_row)
    db.commit()
    db.refresh(app_row)
    return app_row


@router.put("/apps/{app_id}", response_model=AppOut)
async def update_app(
    app_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    app_row = db.get(App, app_id)
    if not app_row:
        raise HTTPException(status_code=404, detail="App not found")

    payload, files = await _parse_app_form(request)
    fields = await _apply_app_uploads(payload, files, existing=app_row)
    for key, value in fields.items():
        setattr(app_row, key, value)
    db.commit()
    db.refresh(app_row)
    return app_row


@router.delete("/apps/{app_id}", status_code=204)
async def delete_app(
    app_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    app_row = db.get(App, app_id)
    if not app_row:
        raise HTTPException(status_code=404, detail="App not found")

    await delete_image(app_row.icon_public_id)
    for group in app_row.screen_groups or []:
        for image in group.get("images", []):
            await delete_image(image.get("public_id"))

    db.delete(app_row)
    db.commit()
    return None


@router.get("/public/apps", response_model=list[AppOut])
def list_public_apps(platform: str | None = None, db: Session = Depends(get_db)):
    query = db.query(App)
    if platform:
        query = query.filter(App.platform == platform)
    return query.order_by(App.sort_order, App.created_at).all()
