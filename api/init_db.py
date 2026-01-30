# Database initialization script for Adminer compatibility
"""
Usage:
    python init_db.py
    
This script:
- Creates database if it doesn't exist
- Creates all tables from models
- Compatible with Adminer for management
"""

from sqlalchemy import text, create_engine
from app.database.session import Base, SessionLocal
from app.core.config import settings
from urllib.parse import quote

def init_db():
    """Initialize database and create tables"""
    print("🔧 Initializing database...")
    print(f"📍 Connecting to: {settings.DATABASE_HOST}:{settings.DATABASE_PORT}")
    print(f"📁 Database: {settings.DATABASE_NAME}")
    
    try:
        # First, create database if not exists (connect without specifying database)
        encoded_password = quote(settings.DATABASE_PASSWORD, safe='')
        admin_engine = create_engine(
            f"mysql+pymysql://{settings.DATABASE_USER}:{encoded_password}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}",
            echo=False
        )
        
        with admin_engine.connect() as connection:
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.DATABASE_NAME}"))
            connection.commit()
            print("✓ Database created/verified")
        
        admin_engine.dispose()
        
        # Now import engine after database exists
        from app.database.session import engine
        
        # Create all tables from models
        Base.metadata.create_all(bind=engine)
        print("✓ Tables created/verified")
        
        # Test connection
        db = SessionLocal()
        try:
            db.execute(text("SELECT 1"))
            print("✓ Connection successful")
            print("\n✅ Database initialization complete!")
            print(f"\n📊 You can manage the database with Adminer:")
            print(f"   Server: {settings.DATABASE_HOST}")
            print(f"   Username: {settings.DATABASE_USER}")
            print(f"   Database: {settings.DATABASE_NAME}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nMake sure MySQL is running and credentials are correct:")
        print(f"  Host: {settings.DATABASE_HOST}")
        print(f"  User: {settings.DATABASE_USER}")
        print(f"  Database: {settings.DATABASE_NAME}")
        raise

if __name__ == "__main__":
    init_db()
