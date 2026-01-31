# Gallery database model for image metadata
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, Boolean
from app.database.session import Base
from datetime import datetime
import enum


class GalleryCategory(str, enum.Enum):
    """Enum for gallery categories"""
    TEMPLE = "temple"
    MYTHOLOGY = "mythology"
    NATURE = "nature"
    CULTURAL = "cultural"
    FESTIVAL = "festival"
    MONUMENT = "monument"
    OTHER = "other"


class Gallery(Base):
    """Gallery model for storing image metadata"""
    __tablename__ = "gallery"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(
        SQLEnum(
            GalleryCategory,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
            native_enum=False,
        ),
        nullable=False,
        index=True,
    )
    image_url = Column(String(1024), nullable=False, unique=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    alt_text = Column(String(500), nullable=True)
    
    # Image metadata
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size = Column(Integer, nullable=True)  # in bytes
    mime_type = Column(String(50), nullable=True)  # e.g., image/jpeg
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<Gallery(id={self.id}, title='{self.title}', category='{self.category}')>"
