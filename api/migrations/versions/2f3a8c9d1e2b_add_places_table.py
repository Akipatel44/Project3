"""Add places table

Revision ID: 2f3a8c9d1e2b
Revises: 6fc25104608c
Create Date: 2026-01-30 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision = '2f3a8c9d1e2b'
down_revision = '6fc25104608c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create places table
    op.create_table(
        'places',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('place_type', sa.Enum('temple', 'mythology_spot', 'nature_spot', name='placetype'), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('address', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_places_name'), 'places', ['name'], unique=False)
    op.create_index(op.f('ix_places_place_type'), 'places', ['place_type'], unique=False)


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_places_place_type'), table_name='places')
    op.drop_index(op.f('ix_places_name'), table_name='places')
    
    # Drop table
    op.drop_table('places')
