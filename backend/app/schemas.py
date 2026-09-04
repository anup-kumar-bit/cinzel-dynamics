from datetime import datetime
from typing import List, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

# ---------- Auth ----------


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr


# ---------- Apps ----------


class ScreenImage(BaseModel):
    url: str = ""
    # None for a pending image — its file arrives in the same multipart
    # request under `screen_{groupIndex}_{imageIndex}`, and the router fills
    # url/public_id back in from the Cloudinary upload result.
    public_id: Optional[str] = None


class ScreenGroup(BaseModel):
    name: str = ""
    images: List[ScreenImage] = Field(default_factory=list)


# The JSON half of a multipart create/update request (see the "data" field
# parsed in routers/apps.py). Any image slot without a matching file in the
# same request keeps whatever url/public_id it already carries here.
class AppIn(BaseModel):
    platform: Literal["ios", "android"]
    name: str
    # Same convention as ScreenGroup images: present when the icon is an
    # already-uploaded reference (e.g. mirrored from another platform's app)
    # rather than a fresh file in this request's `icon` field.
    icon: Optional[ScreenImage] = None
    screen_groups: List[ScreenGroup] = Field(default_factory=list)
    sort_order: int = 0


class AppOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    platform: str
    name: str
    icon_url: Optional[str] = None
    icon_public_id: Optional[str] = None
    screen_groups: List[ScreenGroup]
    sort_order: int
    created_at: datetime
    updated_at: datetime


# ---------- Websites ----------


class WebsiteImage(BaseModel):
    url: str = ""
    # None for a pending image — its file arrives in the same multipart
    # request under `section_{sectionIndex}_{imageIndex}`, and the router
    # fills url/public_id back in from the Cloudinary upload result.
    public_id: Optional[str] = None


class WebsiteSection(BaseModel):
    name: str = ""
    images: List[WebsiteImage] = Field(default_factory=list)


# The JSON half of a multipart create/update request (see the "data" field
# parsed in routers/websites.py). Any image slot without a matching file in
# the same request keeps whatever url/public_id it already carries here.
class WebsiteIn(BaseModel):
    name: str
    domain: str = ""
    sections: List[WebsiteSection] = Field(default_factory=list)


class WebsiteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    domain: str
    sections: List[WebsiteSection]
    created_at: datetime
    updated_at: datetime


# ---------- Portfolio stats ----------
# Single site-wide record, not per project. Unset field = not tracked.


class PortfolioStatsIn(BaseModel):
    needs_fulfilled: Optional[float] = Field(default=None, ge=0, le=100)
    satisfaction: Optional[float] = Field(default=None, ge=0, le=5)
    on_time_delivery: Optional[float] = Field(default=None, ge=0, le=100)


class PortfolioStatsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    needs_fulfilled: Optional[float] = None
    satisfaction: Optional[float] = None
    on_time_delivery: Optional[float] = None
    updated_at: Optional[datetime] = None


# ---------- Routes ----------


class RouteIn(BaseModel):
    slug: str
    nav_name: str
    title: str
    template: Literal["feature-split", "story", "card-grid"]
    content: dict = Field(default_factory=dict)
    status: Literal["draft", "published"] = "draft"
    sort_order: int = 0


class RouteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    nav_name: str
    title: str
    template: str
    content: dict
    status: str
    sort_order: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None


# ---------- Categories ----------


class CategoryIn(BaseModel):
    name: str
    # Auto-slugified from name when omitted.
    slug: Optional[str] = None
    # Set only on create — a category's parent can't change afterward, so
    # CategoryUpdate below has no parent_id field at all.
    parent_id: Optional[UUID] = None


class CategoryUpdate(BaseModel):
    name: str
    slug: Optional[str] = None


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    name: str
    parent_id: Optional[UUID] = None
    status: str
    created_at: datetime
    updated_at: datetime
    archived_at: Optional[datetime] = None


class CategoryParentSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str


# Embedded in BlogPostOut — enough to display and to know whether the
# assigned category is archived, without a second request.
class CategorySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    status: str
    parent: Optional[CategoryParentSummary] = None


# ---------- Blog ----------


class BlogImage(BaseModel):
    url: str = ""
    # None for a pending image — its file arrives in the same multipart
    # request under `cover_image` or `block_{index}`, and the router fills
    # url/public_id back in from the Cloudinary upload result.
    public_id: Optional[str] = None


class BlogBlock(BaseModel):
    type: Literal["paragraph", "heading", "quote", "image"]
    text: str = ""
    image: Optional[BlogImage] = None
    caption: str = ""


class BlogPostIn(BaseModel):
    slug: str
    title: str
    excerpt: str = ""
    author: str = ""
    category_id: Optional[UUID] = None
    tags: List[str] = Field(default_factory=list)
    cover_image: Optional[BlogImage] = None
    content: List[BlogBlock] = Field(default_factory=list)
    status: Literal["draft", "published"] = "draft"


class BlogPostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    excerpt: str
    author: str
    category: Optional[CategorySummary] = None
    tags: List[str]
    cover_image_url: Optional[str] = None
    cover_image_public_id: Optional[str] = None
    content: List[BlogBlock]
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
