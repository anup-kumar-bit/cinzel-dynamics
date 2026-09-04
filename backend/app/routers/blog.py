import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.datastructures import UploadFile

from ..cloudinary_utils import delete_image, upload_image
from ..database import get_db
from ..models import AdminUser, BlogPost, Category
from ..schemas import BlogPostIn, BlogPostOut
from ..security import get_current_admin

router = APIRouter(tags=["blog"])


async def _parse_blog_form(request: Request) -> tuple[BlogPostIn, dict[str, UploadFile]]:
    """Same convention as routes/apps: a `data` JSON field plus files under
    `cover_image` and `block_{index}` for whichever image slots are new
    picks. Existing images are passed through by reference in `data`."""
    form = await request.form()
    raw = form.get("data")
    if raw is None:
        raise HTTPException(status_code=422, detail="Missing 'data' field")
    payload = BlogPostIn.model_validate(json.loads(raw))
    files = {key: value for key, value in form.multi_items() if isinstance(value, UploadFile)}
    return payload, files


def _validate_category_id(db: Session, category_id: uuid.UUID | None, previous_category_id: uuid.UUID | None) -> None:
    """Assigning a category is blocked once it's archived — but only for a
    *new* assignment. A post that already carries an archived category (it
    was active when assigned, then archived later) keeps it on every other
    edit; nothing here forces the author to pick a replacement."""
    if category_id is None or category_id == previous_category_id:
        return
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if category.status == "archived":
        raise HTTPException(status_code=400, detail=f"“{category.name}” is archived and can't be assigned to new posts")


def _existing_block_image(content: list | None, index: int) -> dict | None:
    if not content or index >= len(content):
        return None
    image = content[index].get("image") if isinstance(content[index], dict) else None
    return image if isinstance(image, dict) and "public_id" in image else None


async def _apply_blog_uploads(payload: BlogPostIn, files: dict[str, UploadFile], existing: BlogPost | None) -> dict:
    old_content = existing.content if existing else []
    cover_url = existing.cover_image_url if existing else None
    cover_public_id = existing.cover_image_public_id if existing else None

    if "cover_image" in files:
        if cover_public_id:
            await delete_image(cover_public_id)
        cover_url, cover_public_id = await upload_image(files["cover_image"], folder="blog/cover")
    elif payload.cover_image is not None:
        cover_url = payload.cover_image.url
        cover_public_id = payload.cover_image.public_id
    else:
        cover_url, cover_public_id = None, None

    content = [block.model_dump() for block in payload.content]
    for index, block in enumerate(content):
        file_key = f"block_{index}"
        if block.get("type") != "image":
            continue
        if file_key in files:
            old = _existing_block_image(old_content, index)
            if old:
                await delete_image(old["public_id"])
            url, public_id = await upload_image(files[file_key], folder="blog/body")
            block["image"] = {"url": url, "public_id": public_id}

    return {
        "slug": payload.slug,
        "title": payload.title,
        "excerpt": payload.excerpt,
        "author": payload.author,
        "category_id": payload.category_id,
        "tags": payload.tags,
        "cover_image_url": cover_url,
        "cover_image_public_id": cover_public_id,
        "content": content,
        "status": payload.status,
    }


@router.get("/blog-posts", response_model=list[BlogPostOut])
def list_blog_posts(db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()


@router.get("/blog-posts/{post_id}", response_model=BlogPostOut)
def get_blog_post(post_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/blog-posts", response_model=BlogPostOut, status_code=201)
async def create_blog_post(
    request: Request, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    payload, files = await _parse_blog_form(request)
    _validate_category_id(db, payload.category_id, previous_category_id=None)
    fields = await _apply_blog_uploads(payload, files, existing=None)
    post = BlogPost(**fields)
    db.add(post)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{payload.slug}' is already in use")
    db.refresh(post)
    return post


@router.put("/blog-posts/{post_id}", response_model=BlogPostOut)
async def update_blog_post(
    post_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    payload, files = await _parse_blog_form(request)
    _validate_category_id(db, payload.category_id, previous_category_id=post.category_id)
    fields = await _apply_blog_uploads(payload, files, existing=post)
    for key, value in fields.items():
        setattr(post, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Slug '{payload.slug}' is already in use")
    db.refresh(post)
    return post


@router.patch("/blog-posts/{post_id}/publish", response_model=BlogPostOut)
def publish_blog_post(
    post_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = "published"
    post.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(post)
    return post


@router.patch("/blog-posts/{post_id}/unpublish", response_model=BlogPostOut)
def unpublish_blog_post(
    post_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.status = "draft"
    db.commit()
    db.refresh(post)
    return post


@router.delete("/blog-posts/{post_id}", status_code=204)
async def delete_blog_post(
    post_id: uuid.UUID, db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
):
    post = db.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post.cover_image_public_id:
        await delete_image(post.cover_image_public_id)
    for index, _block in enumerate(post.content or []):
        image = _existing_block_image(post.content, index)
        if image:
            await delete_image(image["public_id"])

    db.delete(post)
    db.commit()
    return None


@router.get("/public/blog-posts", response_model=list[BlogPostOut])
def list_public_blog_posts(db: Session = Depends(get_db)):
    return (
        db.query(BlogPost)
        .filter(BlogPost.status == "published")
        .order_by(BlogPost.published_at.desc())
        .all()
    )


@router.get("/public/blog-posts/{slug}", response_model=BlogPostOut)
def get_public_blog_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.status == "published").first()
    if not post:
        raise HTTPException(status_code=404, detail="Not found")
    return post
