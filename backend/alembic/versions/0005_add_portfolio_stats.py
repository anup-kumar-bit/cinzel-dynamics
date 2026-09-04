"""add portfolio stats

Revision ID: 0005
Revises: 0004
Create Date: 2026-09-05

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "portfolio_stats",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("needs_fulfilled", sa.Float(), nullable=True),
        sa.Column("satisfaction", sa.Float(), nullable=True),
        sa.Column("on_time_delivery", sa.Float(), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("portfolio_stats")
