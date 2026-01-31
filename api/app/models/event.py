# Event database model
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum, Boolean
from app.database.session import Base
from datetime import datetime
import enum

class EventType(str, enum.Enum):
    """Enum for event types"""
    MARATHON = "marathon"
    ASHADHI_BEEJ_MELA = "ashadhi_beej_mela"


class Event(Base):
    """Event model for marathons and melas"""
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    event_type = Column(
        SQLEnum(
            EventType,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
            native_enum=False,
        ),
        nullable=False,
        index=True,
    )
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=True)
    location = Column(String(500), nullable=True)
    image_url = Column(String(1024), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<Event(id={self.id}, name='{self.name}', type='{self.event_type}')>"
