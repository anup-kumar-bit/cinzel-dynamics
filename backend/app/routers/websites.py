import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from ..cloudinary_utils import delete_image, upload_image
from ..database import get_db
from ..models import AdminUser, Website
from ..schemas import WebsiteIn, WebsiteOut
from ..security import get_current_admin

router = APIRouter(tags=["websites"])


async def _parse_website_form(request: Request) -> tuple[WebsiteIn, dict[str, UploadFile]]:
    """Same multipart convention as apps: a `data` field carrying the JSON
    payload (existing image slots already have {url, public_id}), plus zero
    or more files attached under `section_{sectionIndex}_{imageIndex}` for
    whichever screenshots are new picks."""
    form = await request.form()
    raw = form.get("data")
    if raw is None:
        raise HTTPException(status_code=422, detail="Missing 'data' field")
    payload = WebsiteIn.model_validate(json.loads(raw))
    files = {key: value for key, value in form.multi_items() if isinstance(value, UploadFile)}
    return payload, files


async def _apply_website_uploads(payload: WebsiteIn, files: dict[str, UploadFile]) -> dict:
    sections = []
    for section_index, section in enumerate(payload.sections):
        images = []
        for image_index, image in enumerate(section.images):
            file_key = f"section_{section_index}_{image_index}"
            if file_key in files:
                url, public_id = await upload_image(files[file_key], folder="websites/screens")
                images.append({"url": url, "public_id": public_id})
            else:
                images.append({"url": image.url, "public_id": image.public_id})
        sections.append({"name": section.name, "images": images})

    return {
        "name": payload.name,
        "domain": payload.domain,
        "sections": sections,
    }


@router.get("/websites", response_model=list[WebsiteOut])
def list_websites(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    # Creation order is the data — the portfolio page's two browser frames
    # alternate projects by this same order (1st/3rd/5th… vs 2nd/4th/6th…),
    # so admin and public listings both sort by created_at, never sort_order.
    return db.query(Website).order_by(Website.created_at).all()


@router.post("/websites", response_model=WebsiteOut, status_code=201)
async def create_website(
    request: Request, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    payload, files = await _parse_website_form(request)
    fields = await _apply_website_uploads(payload, files)
    website = Website(**fields)
    db.add(website)
    db.commit()
    db.refresh(website)
    return website


@router.put("/websites/{website_id}", response_model=WebsiteOut)
async def update_website(
    website_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    website = db.get(Website, website_id)
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")

    payload, files = await _parse_website_form(request)
    fields = await _apply_website_uploads(payload, files)
    for key, value in fields.items():
        setattr(website, key, value)
    db.commit()
    db.refresh(website)
    return website


@router.delete("/websites/{website_id}", status_code=204)
async def delete_website(
    website_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    website = db.get(Website, website_id)
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")

    for section in website.sections or []:
        for image in section.get("images", []):
            await delete_image(image.get("public_id"))

    db.delete(website)
    db.commit()
    return None


@router.get("/public/websites", response_model=list[WebsiteOut])
def list_public_websites(db: Session = Depends(get_db)):
    return db.query(Website).order_by(Website.created_at).all()
