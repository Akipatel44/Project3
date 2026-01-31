#!/usr/bin/env python
"""Add image_url columns to places and events tables using raw MySQL"""
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database credentials from .env
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'akshay'),
    'password': os.getenv('DB_PASSWORD', 'AKS@2025elite'),
    'database': os.getenv('DB_NAME', 'osamvista')
}

def add_columns():
    """Add image_url columns to places and events tables"""
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Add image_url to places table
        try:
            cursor.execute('ALTER TABLE places ADD COLUMN image_url VARCHAR(1024) NULL')
            conn.commit()
            print('✅ Added image_url column to places table')
        except Error as e:
            if 'Duplicate column' in str(e):
                print('ℹ️  image_url column already exists in places table')
            else:
                raise
        
        # Add image_url to events table
        try:
            cursor.execute('ALTER TABLE events ADD COLUMN image_url VARCHAR(1024) NULL')
            conn.commit()
            print('✅ Added image_url column to events table')
        except Error as e:
            if 'Duplicate column' in str(e):
                print('ℹ️  image_url column already exists in events table')
            else:
                raise
        
        cursor.close()
        conn.close()
        print('\n✅ Database schema update complete!')
        
    except Error as e:
        print(f'❌ Database Error: {e}')
        raise

if __name__ == '__main__':
    print('🔧 Adding image_url columns to database...')
    add_columns()
