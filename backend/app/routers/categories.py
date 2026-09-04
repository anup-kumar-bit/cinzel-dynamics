import re
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AdminUser, Category
from ..schemas import CategoryIn, CategoryOut, CategoryUpdate
from ..security import get_current_admin

router = APIRouter(tags=["categories"])


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "category"


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    return db.query(Category).order_by(Category.name).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(
    payload: CategoryIn, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    parent = None
    if payload.parent_id is not None:
        parent = db.get(Category, payload.parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent category not found")
        if parent.parent_id is not None:
            raise HTTPException(status_code=400, detail="A subcategory can't itself have a subcategory")
        if parent.status == "archived":
            raise HTTPException(status_code=400, detail="Can't add a subcategory under an archived category")

    category = Category(
        slug=payload.slug.strip() if payload.slug else _slugify(payload.name),
        name=payload.name.strip(),
        parent_id=parent.id if parent else None,
        status="active",
    )
    db.add(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{category.slug}' is already in use")
    db.refresh(category)
    return category


@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: uuid.UUID,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # CategoryUpdate has no parent_id field — renaming is the only thing this
    # endpoint allows. Once created, a category's parent (or lack of one)
    # can't change, so there's nothing here that could move it.
    category.name = payload.name.strip()
    category.slug = payload.slug.strip() if payload.slug else _slugify(payload.name)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{category.slug}' is already in use")
    db.refresh(category)
    return category


@router.patch("/categories/{category_id}/archive", response_model=CategoryOut)
def archive_category(
    category_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    now = datetime.now(timezone.utc)
    category.status = "archived"
    category.archived_at = now
    # Archiving a parent takes its subcategories with it — left active,
    # they'd still be pickable but orphaned from any visible parent in the
    # picker. Posts that already reference any of these are untouched; only
    # picking them for a new/changed assignment is blocked (see blog router).
    for child in category.children:
        if child.status != "archived":
            child.status = "archived"
            child.archived_at = now

    db.commit()
    db.refresh(category)
    return category


@router.patch("/categories/{category_id}/restore", response_model=CategoryOut)
def restore_category(
    category_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Restoring a parent does NOT auto-restore its subcategories — each was
    # taken down together, but reviving them is a deliberate per-category
    # choice. A subcategory can't go active while its own parent is still
    # archived, since the picker groups subcategories under their parent.
    if category.parent_id is not None and category.parent is not None and category.parent.status == "archived":
        raise HTTPException(
            status_code=400,
            detail="Restore its parent category first — a subcategory can't be active while its parent is archived",
        )

    category.status = "active"
    category.archived_at = None
    db.commit()
    db.refresh(category)
    return category


@router.get("/public/categories", response_model=list[CategoryOut])
def list_public_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.status == "active").order_by(Category.name).all()
