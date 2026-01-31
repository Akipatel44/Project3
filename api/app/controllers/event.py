# Event controller with CRUD endpoints
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.event import EventService
from app.models.event import EventType
from app.schemas.event import (
    CreateEventRequest,
    UpdateEventRequest,
    EventResponse,
    EventsByTypeResponse,
    EventCountResponse,
    UpcomingEventsResponse
)
from typing import List


event_router = APIRouter(prefix="/api/v1/events", tags=["Events"])


@event_router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new event"
)
def create_event(
    request: CreateEventRequest,
    db: Session = Depends(get_db)
):
    """Create a new event (Marathon or Ashadhi Beej Mela)"""
    try:
        event_type = EventType(request.event_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid event type. Must be one of: {[e.value for e in EventType]}"
        )
    
    event = EventService.create_event(
        db=db,
        name=request.name,
        description=request.description,
        event_type=event_type,
        start_date=request.start_date,
        end_date=request.end_date,
        location=request.location
    )
    return event


@event_router.get(
    "",
    response_model=List[EventResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all events"
)
def get_all_events(
    skip: int = Query(0, ge=0, description="Skip records"),
    limit: int = Query(100, ge=1, le=1000, description="Limit records"),
    active_only: bool = Query(False, description="Show only active events"),
    search: str = Query(None, description="Search by name or description"),
    db: Session = Depends(get_db)
):
    """Retrieve all events with optional search and filtering"""
    if search:
        return EventService.search_events(db, search, skip, limit)
    
    return EventService.get_all_events(db, skip, limit, active_only)


@event_router.get(
    "/upcoming",
    response_model=UpcomingEventsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get upcoming events"
)
def get_upcoming_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Retrieve upcoming events"""
    events = EventService.get_upcoming_events(db, skip, limit)
    return {
        "events": events,
        "total_count": len(events)
    }


@event_router.get(
    "/past",
    response_model=UpcomingEventsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get past events"
)
def get_past_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Retrieve past events"""
    events = EventService.get_past_events(db, skip, limit)
    return {
        "events": events,
        "total_count": len(events)
    }


@event_router.get(
    "/type/{event_type}",
    response_model=EventsByTypeResponse,
    status_code=status.HTTP_200_OK,
    summary="Get events by type"
)
def get_events_by_type(
    event_type: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Retrieve events filtered by type (marathon or ashadhi_beej_mela)"""
    try:
        event_enum = EventType(event_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid event type. Must be one of: {[e.value for e in EventType]}"
        )
    
    events = EventService.get_events_by_type(db, event_enum, skip, limit)
    return {
        "event_type": event_type,
        "events": events,
        "total_count": len(events)
    }


@event_router.get(
    "/stats/types",
    response_model=EventCountResponse,
    status_code=status.HTTP_200_OK,
    summary="Get event statistics"
)
def get_event_stats(db: Session = Depends(get_db)):
    """Get count of events by type"""
    counts = EventService.get_event_count_by_type(db)
    return {
        "marathon": counts.get("marathon", 0),
        "ashadhi_beej_mela": counts.get("ashadhi_beej_mela", 0)
    }


@event_router.get(
    "/{event_id}",
    response_model=EventResponse,
    status_code=status.HTTP_200_OK,
    summary="Get event by ID"
)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve a specific event by ID"""
    event = EventService.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event


@event_router.put(
    "/{event_id}",
    response_model=EventResponse,
    status_code=status.HTTP_200_OK,
    summary="Update event"
)
def update_event(
    event_id: int,
    request: UpdateEventRequest,
    db: Session = Depends(get_db)
):
    """Update an event with partial fields"""
    event = EventService.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    event_type = None
    if request.event_type:
        try:
            event_type = EventType(request.event_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid event type. Must be one of: {[e.value for e in EventType]}"
            )
    
    updated_event = EventService.update_event(
        db=db,
        event_id=event_id,
        name=request.name,
        description=request.description,
        event_type=event_type,
        start_date=request.start_date,
        end_date=request.end_date,
        location=request.location,
        is_active=request.is_active
    )
    return updated_event


@event_router.delete(
    "/{event_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete event"
)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    """Delete an event"""
    event = EventService.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    EventService.delete_event(db, event_id)
    return None


@event_router.patch(
    "/{event_id}/toggle-status",
    response_model=EventResponse,
    status_code=status.HTTP_200_OK,
    summary="Toggle event status"
)
def toggle_event_status(
    event_id: int,
    db: Session = Depends(get_db)
):
    """Toggle event active/inactive status"""
    event = EventService.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    updated_event = EventService.toggle_event_status(db, event_id)
    return updated_event
