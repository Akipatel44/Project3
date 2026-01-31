# Place database model
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Enum as SQLEnum
from app.database.session import Base
from datetime import datetime
import enum

class PlaceType(str, enum.Enum):
    """Enum for place types"""
    TEMPLE = "temple"
    MYTHOLOGY_SPOT = "mythology_spot"
    NATURE_SPOT = "nature_spot"


class Place(Base):
    """Place model for temples, mythology spots, and nature spots"""
    __tablename__ = "places"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    place_type = Column(
        SQLEnum(
            PlaceType,
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
            native_enum=False,
        ),
        nullable=False,
        index=True,
    )
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self) -> str:
        return f"<Place(id={self.id}, name='{self.name}', type='{self.place_type}')>"
