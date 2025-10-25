"""add playlists tables

Revision ID: b1a2c3d4e5f6
Revises: 1a9c23c1eb8e
Create Date: 2025-10-25 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b1a2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '1a9c23c1eb8e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create playlists table
    op.create_table(
        'playlists',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('external_id', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('followers', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('tags', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_playlists_external_id'), 'playlists', ['external_id'], unique=True)

    # Create playlist_movies association table
    op.create_table(
        'playlist_movies',
        sa.Column('playlist_id', sa.Integer(), nullable=False),
        sa.Column('movie_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['playlist_id'], ['playlists.id']),
        sa.ForeignKeyConstraint(['movie_id'], ['movies.id']),
        sa.PrimaryKeyConstraint('playlist_id', 'movie_id')
    )


def downgrade() -> None:
    op.drop_table('playlist_movies')
    op.drop_index(op.f('ix_playlists_external_id'), table_name='playlists')
    op.drop_table('playlists')

