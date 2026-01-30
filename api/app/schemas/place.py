# Place Pydantic Schemas
"""Request and response schemas for place endpoints"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PlaceTypeEnum(str, Enum):
    """Place type enumeration"""
    TEMPLE = "temple"
    MYTHOLOGY_SPOT = "mythology_spot"
    NATURE_SPOT = "nature_spot"


# ==================== REQUEST SCHEMAS ====================

class CreatePlaceRequest(BaseModel):
    """Schema for creating a new place"""
    name: str = Field(..., min_length=1, max_length=255, description="Place name")
    description: Optional[str] = Field(None, max_length=5000, description="Detailed description")
    place_type: PlaceTypeEnum = Field(..., description="Type: temple, mythology_spot, nature_spot")
    latitude: Optional[float] = Field(None, description="GPS latitude coordinate")
    longitude: Optional[float] = Field(None, description="GPS longitude coordinate")
    address: Optional[str] = Field(None, max_length=500, description="Physical address")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Varanasi Ghats",
                "description": "Ancient ghats along the Ganges River",
                "place_type": "temple",
                "latitude": 25.3176,
                "longitude": 82.9739,
                "address": "Varanasi, Uttar Pradesh, India"
            }
        }


class UpdatePlaceRequest(BaseModel):
    """Schema for updating a place"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    place_type: Optional[PlaceTypeEnum] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Place Name",
                "description": "Updated description"
            }
        }


# ==================== RESPONSE SCHEMAS ====================

class PlaceResponse(BaseModel):
    """Place response schema"""
    id: int
    name: str
    description: Optional[str]
    place_type: str
    latitude: Optional[float]
    longitude: Optional[float]
    address: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Varanasi Ghats",
                "description": "Ancient ghats along the Ganges River",
                "place_type": "temple",
                "latitude": 25.3176,
                "longitude": 82.9739,
                "address": "Varanasi, Uttar Pradesh, India",
                "created_at": "2026-01-30T10:00:00",
                "updated_at": "2026-01-30T10:00:00"
            }
        }


class PlaceListResponse(BaseModel):
    """Response for place list endpoint"""
    total: int
    count: int
    places: List[PlaceResponse]
    
    class Config:
        json_schema_extra = {
            "example": {
                "total": 100,
                "count": 10,
                "places": []
            }
        }


class CreatePlaceResponse(BaseModel):
    """Response for place creation"""
    message: str
    place: PlaceResponse
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Place created successfully",
                "place": {}
            }
        }


class UpdatePlaceResponse(BaseModel):
    """Response for place update"""
    message: str
    place: PlaceResponse


class DeletePlaceResponse(BaseModel):
    """Response for place deletion"""
    message: str
    place_id: int


class PlacesByTypeResponse(BaseModel):
    """Response for places filtered by type"""
    place_type: str
    total: int
    count: int
    places: List[PlaceResponse]
