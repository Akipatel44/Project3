# Pydantic schemas for Gallery API
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional


class CreateGalleryRequest(BaseModel):
    """Schema for creating a gallery entry"""
    category: str = Field(..., description="Gallery category: temple, mythology, nature, cultural, festival, monument, other")
    image_url: str = Field(..., description="URL to the image")
    title: str = Field(..., min_length=1, max_length=255, description="Image title")
    description: Optional[str] = Field(None, description="Image description")
    alt_text: Optional[str] = Field(None, max_length=500, description="Alternative text for accessibility")
    width: Optional[int] = Field(None, ge=1, description="Image width in pixels")
    height: Optional[int] = Field(None, ge=1, description="Image height in pixels")
    file_size: Optional[int] = Field(None, ge=1, description="File size in bytes")
    mime_type: Optional[str] = Field(None, max_length=50, description="MIME type (e.g., image/jpeg)")
    
    class Config:
        examples = {
            "application/json": {
                "category": "temple",
                "image_url": "https://cdn.example.com/temple-01.jpg",
                "title": "Shiva Temple",
                "description": "Ancient temple dedicated to Lord Shiva",
                "alt_text": "Ancient stone temple with intricate carvings",
                "width": 1920,
                "height": 1080,
                "file_size": 1024000,
                "mime_type": "image/jpeg"
            }
        }


class UpdateGalleryRequest(BaseModel):
    """Schema for updating a gallery entry"""
    category: Optional[str] = Field(None)
    image_url: Optional[str] = Field(None)
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None)
    alt_text: Optional[str] = Field(None, max_length=500)
    width: Optional[int] = Field(None, ge=1)
    height: Optional[int] = Field(None, ge=1)
    file_size: Optional[int] = Field(None, ge=1)
    mime_type: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = Field(None)


class GalleryResponse(BaseModel):
    """Schema for gallery entry response"""
    id: int
    category: str
    image_url: str
    title: str
    description: Optional[str]
    alt_text: Optional[str]
    width: Optional[int]
    height: Optional[int]
    file_size: Optional[int]
    mime_type: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class GalleryCategoryResponse(BaseModel):
    """Schema for gallery entries by category"""
    category: str
    entries: list[GalleryResponse]
    total_count: int


class GalleryCategoryStatsResponse(BaseModel):
    """Schema for gallery statistics by category"""
    temple: int
    mythology: int
    nature: int
    cultural: int
    festival: int
    monument: int
    other: int


class GalleryRecentResponse(BaseModel):
    """Schema for recent gallery entries"""
    entries: list[GalleryResponse]
    total_count: int
