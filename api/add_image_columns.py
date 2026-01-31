#!/usr/bin/env python
"""Add image_url columns to places and events tables"""
import os
import sys
from pathlib import Path

# Add app path to Python path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import text
from app.database.session import engine

def add_image_url_columns():
    """Add image_url columns to places and events tables"""
    with engine.connect() as conn:
        # Add image_url to places table
        try:
            conn.execute(text('ALTER TABLE places ADD COLUMN image_url VARCHAR(1024) NULL'))
            conn.commit()
            print('✅ Added image_url column to places table')
        except Exception as e:
            if 'Duplicate column' in str(e) or 'Duplicate' in str(e):
                print('ℹ️  image_url column already exists in places table')
            else:
                print(f'❌ Error adding image_url to places: {e}')
        
        # Add image_url to events table
        try:
            conn.execute(text('ALTER TABLE events ADD COLUMN image_url VARCHAR(1024) NULL'))
            conn.commit()
            print('✅ Added image_url column to events table')
        except Exception as e:
            if 'Duplicate column' in str(e) or 'Duplicate' in str(e):
                print('ℹ️  image_url column already exists in events table')
            else:
                print(f'❌ Error adding image_url to events: {e}')

if __name__ == '__main__':
    print('🔧 Adding image_url columns to database...')
    add_image_url_columns()
    print('✅ Database update complete!')
