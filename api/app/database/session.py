# Database configuration and session management
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()

def init_tables():
    """Create all tables and add missing columns to existing tables"""
    try:
        # First, create all tables that don't exist
        Base.metadata.create_all(bind=engine)
        
        # Then, add missing columns to existing tables
        with engine.connect() as conn:
            try:
                # Add image_url to places if it doesn't exist
                conn.execute(text('ALTER TABLE places ADD COLUMN image_url VARCHAR(1024) NULL'))
                conn.commit()
            except:
                # Column already exists or other error
                pass
            
            try:
                # Add image_url to events if it doesn't exist
                conn.execute(text('ALTER TABLE events ADD COLUMN image_url VARCHAR(1024) NULL'))
                conn.commit()
            except:
                # Column already exists or other error
                pass
    except Exception as e:
        print(f"⚠️  Could not initialize tables: {e}")

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
