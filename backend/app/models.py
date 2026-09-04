import uuid

from sqlalchemy import CheckConstraint, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class App(Base):
    __tablename__ = "apps"
    __table_args__ = (CheckConstraint("platform IN ('ios', 'android')", name="ck_apps_platform"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(String, nullable=False)
    name = Column(String, nullable=False)
    icon_url = Column(String, nullable=True)
    icon_public_id = Column(String, nullable=True)
    # [{ "name": str, "images": [{ "url": str, "public_id": str }] }]
    screen_groups = Column(JSONB, nullable=False, default=list)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Website(Base):
    __tablename__ = "websites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False, default="")
    # [{ "name": str, "images": [{ "url": str, "public_id": str }] }]
    sections = Column(JSONB, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# Site-wide, not per project — a single row.
class PortfolioStats(Base):
    __tablename__ = "portfolio_stats"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    needs_fulfilled = Column(Float, nullable=True)
    satisfaction = Column(Float, nullable=True)
    on_time_delivery = Column(Float, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Route(Base):
    __tablename__ = "routes"
    __table_args__ = (
        CheckConstraint("template IN ('feature-split', 'story', 'card-grid')", name="ck_routes_template"),
        CheckConstraint("status IN ('draft', 'published')", name="ck_routes_status"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, nullable=False, unique=True)
    nav_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    template = Column(String, nullable=False)
    # Shape depends on `template` — see app/_shared/service-templates/registry.js
    # on the frontend for the exact per-template fields. Image fields inside
    # (heroImage, sections[].image) store { "url": str, "public_id": str }.
    content = Column(JSONB, nullable=False, default=dict)
    status = Column(String, nullable=False, default="draft")
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)


class Category(Base):
    __tablename__ = "categories"
    __table_args__ = (CheckConstraint("status IN ('active', 'archived')", name="ck_categories_status"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    # Null = top-level (parent) category. Set = subcategory, and only ever
    # points at a top-level category — a subcategory can't itself have a
    # subcategory (enforced in the router, not here). Immutable after
    # creation: the update endpoint's schema has no parent_id field at all.
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    # "archived" is a soft delete — a category in use by posts is never hard
    # deleted, so those posts keep displaying it. Archived categories just
    # drop out of the picker for new/changed assignments.
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    archived_at = Column(DateTime(timezone=True), nullable=True)

    parent = relationship("Category", remote_side=[id], backref="children")


class BlogPost(Base):
    __tablename__ = "blog_posts"
    __table_args__ = (CheckConstraint("status IN ('draft', 'published')", name="ck_blog_posts_status"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String, nullable=False, unique=True)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=False, default="")
    author = Column(String, nullable=False, default="")
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    tags = Column(JSONB, nullable=False, default=list)
    cover_image_url = Column(String, nullable=True)
    cover_image_public_id = Column(String, nullable=True)
    # [{ "type": "paragraph"|"heading"|"quote"|"image", "text": str,
    #    "image": { "url": str, "public_id": str } | None, "caption": str }]
    content = Column(JSONB, nullable=False, default=list)
    status = Column(String, nullable=False, default="draft")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)

    category = relationship("Category")
