"""Add image_url columns to places and events tables

Revision ID: 8a9b0c1d2e3f
Revises: 4p5q6r7s8t9u
Create Date: 2026-01-31 12:35:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = '8a9b0c1d2e3f'
down_revision = '4p5q6r7s8t9u'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add image_url column to places table
    op.add_column('places', sa.Column('image_url', sa.String(length=1024), nullable=True))
    
    # Add image_url column to events table
    op.add_column('events', sa.Column('image_url', sa.String(length=1024), nullable=True))


def downgrade() -> None:
    # Remove image_url column from events table
    op.drop_column('events', 'image_url')
    
    # Remove image_url column from places table
    op.drop_column('places', 'image_url')
