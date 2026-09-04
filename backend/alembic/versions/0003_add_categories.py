"""add categories

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-04

"""
import re

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "category"


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("slug", sa.String(), nullable=False, unique=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("parent_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id"), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('active', 'archived')", name="ck_categories_status"),
    )

    op.add_column(
        "blog_posts",
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id"), nullable=True),
    )

    # Carry every distinct existing free-text category over as a top-level
    # category row, then point posts at it — no post loses its category.
    conn = op.get_bind()
    rows = conn.execute(
        sa.text("SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category != ''")
    ).fetchall()

    used_slugs: set[str] = set()
    for (name,) in rows:
        base_slug = _slugify(name)
        slug = base_slug
        suffix = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        used_slugs.add(slug)

        category_id = conn.execute(
            sa.text(
                "INSERT INTO categories (id, slug, name, status) "
                "VALUES (gen_random_uuid(), :slug, :name, 'active') RETURNING id"
            ),
            {"slug": slug, "name": name},
        ).scalar()
        conn.execute(
            sa.text("UPDATE blog_posts SET category_id = :cid WHERE category = :name"),
            {"cid": category_id, "name": name},
        )

    op.drop_column("blog_posts", "category")


def downgrade() -> None:
    op.add_column("blog_posts", sa.Column("category", sa.String(), nullable=False, server_default=""))

    conn = op.get_bind()
    conn.execute(
        sa.text(
            "UPDATE blog_posts SET category = categories.name "
            "FROM categories WHERE blog_posts.category_id = categories.id"
        )
    )

    op.drop_column("blog_posts", "category_id")
    op.drop_table("categories")
