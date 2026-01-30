# Event service for CRUD operations
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.event import Event, EventType
from datetime import datetime


class EventService:
    """Service layer for Event operations"""
    
    @staticmethod
    def create_event(
        db: Session,
        name: str,
        description: str,
        event_type: EventType,
        start_date: datetime,
        end_date: datetime = None,
        location: str = None
    ) -> Event:
        """Create a new event"""
        event = Event(
            name=name,
            description=description,
            event_type=event_type,
            start_date=start_date,
            end_date=end_date,
            location=location
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def get_event_by_id(db: Session, event_id: int) -> Event:
        """Retrieve event by ID"""
        return db.query(Event).filter(Event.id == event_id).first()
    
    @staticmethod
    def get_all_events(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False
    ) -> list[Event]:
        """Retrieve all events with pagination"""
        query = db.query(Event)
        
        if active_only:
            query = query.filter(Event.is_active == True)
        
        return query.order_by(Event.start_date.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_events_by_type(
        db: Session,
        event_type: EventType,
        skip: int = 0,
        limit: int = 100
    ) -> list[Event]:
        """Retrieve events filtered by type"""
        return (
            db.query(Event)
            .filter(Event.event_type == event_type)
            .order_by(Event.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def search_events(
        db: Session,
        query_text: str,
        skip: int = 0,
        limit: int = 100
    ) -> list[Event]:
        """Search events by name or description"""
        search_term = f"%{query_text}%"
        return (
            db.query(Event)
            .filter(
                or_(
                    Event.name.ilike(search_term),
                    Event.description.ilike(search_term)
                )
            )
            .order_by(Event.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_upcoming_events(
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Event]:
        """Retrieve upcoming events (start_date >= now)"""
        now = datetime.utcnow()
        return (
            db.query(Event)
            .filter(
                and_(
                    Event.start_date >= now,
                    Event.is_active == True
                )
            )
            .order_by(Event.start_date.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_past_events(
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Event]:
        """Retrieve past events (start_date < now)"""
        now = datetime.utcnow()
        return (
            db.query(Event)
            .filter(Event.start_date < now)
            .order_by(Event.start_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def update_event(
        db: Session,
        event_id: int,
        name: str = None,
        description: str = None,
        event_type: EventType = None,
        start_date: datetime = None,
        end_date: datetime = None,
        location: str = None,
        is_active: bool = None
    ) -> Event:
        """Update event with partial fields"""
        event = EventService.get_event_by_id(db, event_id)
        if not event:
            return None
        
        if name is not None:
            event.name = name
        if description is not None:
            event.description = description
        if event_type is not None:
            event.event_type = event_type
        if start_date is not None:
            event.start_date = start_date
        if end_date is not None:
            event.end_date = end_date
        if location is not None:
            event.location = location
        if is_active is not None:
            event.is_active = is_active
        
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def delete_event(db: Session, event_id: int) -> bool:
        """Delete an event"""
        event = EventService.get_event_by_id(db, event_id)
        if not event:
            return False
        
        db.delete(event)
        db.commit()
        return True
    
    @staticmethod
    def toggle_event_status(db: Session, event_id: int) -> Event:
        """Toggle event active status"""
        event = EventService.get_event_by_id(db, event_id)
        if not event:
            return None
        
        event.is_active = not event.is_active
        db.commit()
        db.refresh(event)
        return event
    
    @staticmethod
    def get_event_count_by_type(db: Session) -> dict:
        """Get count of events by type"""
        counts = {}
        for event_type in EventType:
            count = db.query(Event).filter(Event.event_type == event_type).count()
            counts[event_type.value] = count
        return counts
