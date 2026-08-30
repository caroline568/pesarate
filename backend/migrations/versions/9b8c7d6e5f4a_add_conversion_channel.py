"""add channel to saved conversions

Revision ID: 9b8c7d6e5f4a
Revises: 87a03f8c9bf5
"""
from alembic import op
import sqlalchemy as sa

revision = "9b8c7d6e5f4a"
down_revision = "87a03f8c9bf5"
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table("saved_conversions", schema=None) as batch_op:
        batch_op.add_column(sa.Column("channel", sa.String(length=40), nullable=True))

def downgrade():
    with op.batch_alter_table("saved_conversions", schema=None) as batch_op:
        batch_op.drop_column("channel")
