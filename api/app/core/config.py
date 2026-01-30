# Core configuration for FastAPI application
import os
from dotenv import load_dotenv
from functools import lru_cache

# Load environment variables from .env
load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # Database Configuration (MySQL with Adminer compatibility)
    DATABASE_HOST: str = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT: str = os.getenv("DATABASE_PORT", "3306")
    DATABASE_USER: str = os.getenv("DATABASE_USER", "akshay")
    DATABASE_PASSWORD: str = os.getenv("DATABASE_PASSWORD", "AKS@2025elite")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "osamvista")
    
    @property
    def DATABASE_URL(self) -> str:
        """Construct SQLAlchemy database URL"""
        return (
            f"mysql+pymysql://"
            f"{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}"
            f"/{self.DATABASE_NAME}"
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
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS
    ALLOWED_HOSTS: list = ["*"]

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

settings = get_settings()
