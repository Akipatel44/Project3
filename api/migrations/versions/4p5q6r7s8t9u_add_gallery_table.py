"""Add gallery table

Revision ID: 4p5q6r7s8t9u
Revises: 3k9l4m5n6o7p
Create Date: 2026-01-30 12:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4p5q6r7s8t9u'
down_revision = '3k9l4m5n6o7p'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create gallery table
    op.create_table(
        'gallery',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('category', sa.Enum('temple', 'mythology', 'nature', 'cultural', 'festival', 'monument', 'other', name='gallerycategory'), nullable=False),
        sa.Column('image_url', sa.String(1024), nullable=False, unique=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('alt_text', sa.String(500), nullable=True),
        sa.Column('width', sa.Integer(), nullable=True),
        sa.Column('height', sa.Integer(), nullable=True),
        sa.Column('file_size', sa.Integer(), nullable=True),
        sa.Column('mime_type', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_gallery_category'), 'gallery', ['category'])
    op.create_index(op.f('ix_gallery_title'), 'gallery', ['title'])
    op.create_index(op.f('ix_gallery_image_url'), 'gallery', ['image_url'], unique=True)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_gallery_image_url'), table_name='gallery')
    op.drop_index(op.f('ix_gallery_title'), table_name='gallery')
    op.drop_index(op.f('ix_gallery_category'), table_name='gallery')
    
    # Drop table
    op.drop_table('gallery')
