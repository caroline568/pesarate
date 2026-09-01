"""add user use cases

Revision ID: 6c4d2e1f8a90
Revises: 242f2eca9fbc
Create Date: 2026-09-01 20:00:00

"""
from alembic import op
import sqlalchemy as sa


revision = "6c4d2e1f8a90"
down_revision = "242f2eca9fbc"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(sa.Column("use_cases", sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("use_cases")