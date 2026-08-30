"""add user avatar and google auth fields

Revision ID: 242f2eca9fbc
Revises: e337a7d28f55
Create Date: 2026-08-30 12:08:07.773246

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '242f2eca9fbc'
down_revision = 'e337a7d28f55'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('password_hash', existing_type=sa.String(length=255), nullable=True)
        batch_op.add_column(sa.Column('avatar', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('auth_provider', sa.String(length=20), nullable=False, server_default='password'))
        batch_op.add_column(sa.Column('google_sub', sa.String(length=255), nullable=True))
        batch_op.create_unique_constraint('uq_users_google_sub', ['google_sub'])


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('uq_users_google_sub', type_='unique')
        batch_op.drop_column('google_sub')
        batch_op.drop_column('auth_provider')
        batch_op.drop_column('avatar')
        batch_op.alter_column('password_hash', existing_type=sa.String(length=255), nullable=False)
