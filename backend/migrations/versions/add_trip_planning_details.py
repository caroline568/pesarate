"""add trip planning details

Revision ID: a1b2c3d4e5f6
Revises: 99019df058d0
Create Date: 2026-09-03
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a1b2c3d4e5f6"
down_revision = "99019df058d0"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "trips",
        sa.Column("country_code", sa.String(length=2), nullable=True),
    )
    op.add_column(
        "trips",
        sa.Column("budget_breakdown", sa.JSON(), nullable=True),
    )
    op.add_column(
        "trips",
        sa.Column(
            "currency_recommendation",
            sa.String(length=3),
            nullable=True,
        ),
    )
    op.add_column(
        "trips",
        sa.Column(
            "channel_recommendation",
            sa.String(length=40),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_column("trips", "channel_recommendation")
    op.drop_column("trips", "currency_recommendation")
    op.drop_column("trips", "budget_breakdown")
    op.drop_column("trips", "country_code")
