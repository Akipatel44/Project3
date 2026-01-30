# Core configuration for FastAPI application
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:password@localhost:3306/osamvista"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", 
        "your-secret-key-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App
    APP_NAME: str = "OsamVista API"
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    
    # CORS
    ALLOWED_HOSTS: list = ["*"]

settings = Settings()
