"""Add events table

Revision ID: 3k9l4m5n6o7p
Revises: 2f3a8c9d1e2b
Create Date: 2026-01-30 12:18:28.123456

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3k9l4m5n6o7p'
down_revision = '2f3a8c9d1e2b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create events table
    op.create_table(
        'events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('event_type', sa.Enum('marathon', 'ashadhi_beej_mela', name='eventtype'), nullable=False),
        sa.Column('start_date', sa.DateTime(), nullable=False),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('location', sa.String(500), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_events_name'), 'events', ['name'])
    op.create_index(op.f('ix_events_event_type'), 'events', ['event_type'])
    op.create_index(op.f('ix_events_start_date'), 'events', ['start_date'])


def downgrade() -> None:
    # Drop indexes
    op.drop_index(op.f('ix_events_start_date'), table_name='events')
    op.drop_index(op.f('ix_events_event_type'), table_name='events')
    op.drop_index(op.f('ix_events_name'), table_name='events')
    
    # Drop table
    op.drop_table('events')
