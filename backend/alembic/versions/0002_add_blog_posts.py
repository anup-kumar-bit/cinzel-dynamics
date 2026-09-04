"""add blog_posts

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-04

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "blog_posts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("slug", sa.String(), nullable=False, unique=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("excerpt", sa.String(), nullable=False, server_default=""),
        sa.Column("author", sa.String(), nullable=False, server_default=""),
        sa.Column("category", sa.String(), nullable=False, server_default=""),
        sa.Column("tags", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("cover_image_url", sa.String(), nullable=True),
        sa.Column("cover_image_public_id", sa.String(), nullable=True),
        sa.Column("content", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("status", sa.String(), nullable=False, server_default="draft"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("status IN ('draft', 'published')", name="ck_blog_posts_status"),
    )


def downgrade() -> None:
    op.drop_table("blog_posts")
