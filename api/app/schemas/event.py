# Pydantic schemas for Event API
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CreateEventRequest(BaseModel):
    """Schema for creating an event"""
    name: str = Field(..., min_length=1, max_length=255, description="Event name")
    description: Optional[str] = Field(None, description="Event description")
    event_type: str = Field(..., description="Event type: marathon or ashadhi_beej_mela")
    start_date: datetime = Field(..., description="Event start date")
    end_date: Optional[datetime] = Field(None, description="Event end date")
    location: Optional[str] = Field(None, max_length=500, description="Event location")
    
    class Config:
        examples = {
            "application/json": {
                "name": "Mumbai Marathon 2026",
                "description": "Annual city marathon event",
                "event_type": "marathon",
                "start_date": "2026-02-15T06:00:00",
                "end_date": "2026-02-15T10:00:00",
                "location": "Marine Drive, Mumbai"
            }
        }


class UpdateEventRequest(BaseModel):
    """Schema for updating an event"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None)
    event_type: Optional[str] = Field(None)
    start_date: Optional[datetime] = Field(None)
    end_date: Optional[datetime] = Field(None)
    location: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = Field(None)


class EventResponse(BaseModel):
    """Schema for event response"""
    id: int
    name: str
    description: Optional[str]
    event_type: str
    start_date: datetime
    end_date: Optional[datetime]
    location: Optional[str]
    image_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EventsByTypeResponse(BaseModel):
    """Schema for events filtered by type"""
    event_type: str
    events: list[EventResponse]
    total_count: int


class EventCountResponse(BaseModel):
    """Schema for event statistics"""
    marathon: int
    ashadhi_beej_mela: int


class UpcomingEventsResponse(BaseModel):
    """Schema for upcoming events"""
    events: list[EventResponse]
    total_count: int
