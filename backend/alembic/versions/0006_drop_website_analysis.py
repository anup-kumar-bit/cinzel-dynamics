"""drop website analysis column

Revision ID: 0006
Revises: 0005
Create Date: 2026-09-05

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("websites", "analysis")


def downgrade() -> None:
    op.add_column(
        "websites",
        sa.Column("analysis", postgresql.JSONB(), nullable=False, server_default="{}"),
    )
