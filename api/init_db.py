# Database initialization script for Adminer compatibility
"""
Usage:
    python init_db.py
    
This script:
- Creates database if it doesn't exist
- Creates all tables from models
- Compatible with Adminer for management
"""

from sqlalchemy import text
from app.database.session import engine, Base, SessionLocal
from app.core.config import settings

def init_db():
    """Initialize database and create tables"""
    print("🔧 Initializing database...")
    print(f"📍 Connecting to: {settings.DATABASE_HOST}:{settings.DATABASE_PORT}")
    print(f"📁 Database: {settings.DATABASE_NAME}")
    
    try:
        # Create database if not exists
        with engine.connect() as connection:
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {settings.DATABASE_NAME}"))
            connection.commit()
            print("✓ Database created/verified")
        
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
