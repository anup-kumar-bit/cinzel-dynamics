import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from ..cloudinary_utils import delete_image, upload_image
from ..database import get_db
from ..models import AdminUser, Route
from ..schemas import RouteIn, RouteOut
from ..security import get_current_admin

router = APIRouter(tags=["routes"])


async def _parse_route_form(request: Request) -> tuple[RouteIn, dict[str, UploadFile]]:
    """Same convention as apps: a `data` JSON field plus files under
    `hero_image` (feature-split) or `section_{index}` (story) for whichever
    image slots are new picks. card-grid has none — its card icons are
    iconify class strings, not uploads. No separate upload endpoint."""
    form = await request.form()
    raw = form.get("data")
    if raw is None:
        raise HTTPException(status_code=422, detail="Missing 'data' field")
    payload = RouteIn.model_validate(json.loads(raw))
    files = {key: value for key, value in form.multi_items() if isinstance(value, UploadFile)}
    return payload, files


def _existing_image(content: dict | None, *path) -> dict | None:
    """Digs an {url, public_id} object out of a previously-saved content
    blob, following `path` through nested dict/list keys."""
    node = content or {}
    for key in path:
        if isinstance(node, list):
            if not isinstance(key, int) or key >= len(node):
                return None
            node = node[key]
        elif isinstance(node, dict):
            node = node.get(key)
        else:
            return None
    return node if isinstance(node, dict) and "public_id" in node else None


async def _apply_route_uploads(payload: RouteIn, files: dict[str, UploadFile], existing: Route | None) -> dict:
    content = dict(payload.content)
    old_content = existing.content if existing else {}

    if payload.template == "feature-split" and "hero_image" in files:
        old = _existing_image(old_content, "heroImage")
        if old:
            await delete_image(old["public_id"])
        url, public_id = await upload_image(files["hero_image"], folder="routes/hero")
        content["heroImage"] = {"url": url, "public_id": public_id}

    elif payload.template == "story":
        sections = content.get("sections", [])
        for index, section in enumerate(sections):
            file_key = f"section_{index}"
            if file_key not in files:
                continue
            old = _existing_image(old_content, "sections", index, "image")
            if old:
                await delete_image(old["public_id"])
            url, public_id = await upload_image(files[file_key], folder="routes/sections")
            section["image"] = {"url": url, "public_id": public_id}
        content["sections"] = sections

    return {
        "slug": payload.slug,
        "nav_name": payload.nav_name,
        "title": payload.title,
        "template": payload.template,
        "content": content,
        "status": payload.status,
        "sort_order": payload.sort_order,
    }


@router.get("/routes", response_model=list[RouteOut])
def list_routes(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    return db.query(Route).order_by(Route.sort_order, Route.created_at).all()


@router.get("/routes/{route_id}", response_model=RouteOut)
def get_route(route_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route


@router.post("/routes", response_model=RouteOut, status_code=201)
async def create_route(
    request: Request, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    payload, files = await _parse_route_form(request)
    fields = await _apply_route_uploads(payload, files, existing=None)
    route = Route(**fields)
    db.add(route)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{payload.slug}' is already in use")
    db.refresh(route)
    return route


@router.put("/routes/{route_id}", response_model=RouteOut)
async def update_route(
    route_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    payload, files = await _parse_route_form(request)
    fields = await _apply_route_uploads(payload, files, existing=route)
    for key, value in fields.items():
        setattr(route, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{payload.slug}' is already in use")
    db.refresh(route)
    return route


@router.patch("/routes/{route_id}/publish", response_model=RouteOut)
def publish_route(
    route_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    route.status = "published"
    route.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(route)
    return route


@router.patch("/routes/{route_id}/unpublish", response_model=RouteOut)
def unpublish_route(
    route_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    route.status = "draft"
    db.commit()
    db.refresh(route)
    return route


@router.delete("/routes/{route_id}", status_code=204)
async def delete_route(
    route_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    route = db.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    hero = _existing_image(route.content, "heroImage")
    if hero:
        await delete_image(hero["public_id"])
    for index, _section in enumerate((route.content or {}).get("sections", [])):
        image = _existing_image(route.content, "sections", index, "image")
        if image:
            await delete_image(image["public_id"])

    db.delete(route)
    db.commit()
    return None


@router.get("/public/routes", response_model=list[RouteOut])
def list_public_routes(db: Session = Depends(get_db)):
    return db.query(Route).filter(Route.status == "published").order_by(Route.sort_order, Route.created_at).all()


@router.get("/public/routes/{slug}", response_model=RouteOut)
def get_public_route(slug: str, db: Session = Depends(get_db)):
    route = db.query(Route).filter(Route.slug == slug, Route.status == "published").first()
    if not route:
        raise HTTPException(status_code=404, detail="Not found")
    return route
