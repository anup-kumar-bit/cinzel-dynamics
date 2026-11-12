"""allow 'custom' route template

Revision ID: 0007
Revises: ce506008b4c1
"""
from alembic import op


revision = '0007'
down_revision = 'ce506008b4c1'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint('ck_routes_template', 'routes', type_='check')
    op.create_check_constraint(
        'ck_routes_template', 'routes', "template IN ('feature-split', 'story', 'card-grid', 'custom')"
    )


def downgrade() -> None:
    op.drop_constraint('ck_routes_template', 'routes', type_='check')
    op.create_check_constraint(
        'ck_routes_template', 'routes', "template IN ('feature-split', 'story', 'card-grid')"
    )
