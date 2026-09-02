"""merge migration heads

Revision ID: 99019df058d0
Revises: 6c4d2e1f8a90, 9b8c7d6e5f4a
Create Date: 2026-09-02 19:41:56.487657

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '99019df058d0'
down_revision = ('6c4d2e1f8a90', '9b8c7d6e5f4a')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
