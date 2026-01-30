# Place Service
"""
PlaceService handles all business logic for place operations.
Manages CRUD operations for temples, mythology spots, and nature spots.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Place, PlaceType
from app.schemas.place import CreatePlaceRequest, UpdatePlaceRequest


class PlaceService:
    """Service for place operations"""
    
    # ==================== CREATE ====================
    
    @staticmethod
    def create_place(
        db: Session,
        place_data: CreatePlaceRequest
    ) -> Place:
        """
        Create a new place
        
        Args:
            db: Database session
            place_data: Place creation data
            
        Returns:
            Created Place object
        """
        db_place = Place(
            name=place_data.name,
            description=place_data.description,
            place_type=PlaceType(place_data.place_type),
            latitude=place_data.latitude,
            longitude=place_data.longitude,
            address=place_data.address
        )
        db.add(db_place)
        db.commit()
        db.refresh(db_place)
        return db_place
    
    # ==================== READ ====================
    
    @staticmethod
    def get_place_by_id(db: Session, place_id: int) -> Optional[Place]:
        """
        Get place by ID
        
        Args:
            db: Database session
            place_id: Place ID
            
        Returns:
            Place object or None if not found
        """
        return db.query(Place).filter(Place.id == place_id).first()
    
    @staticmethod
    def get_all_places(
        db: Session,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Place], int]:
        """
        Get all places with pagination
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum records to return
            
        Returns:
            Tuple of (list of places, total count)
        """
        total = db.query(Place).count()
        places = db.query(Place).order_by(
            desc(Place.created_at)
        ).offset(skip).limit(limit).all()
        return places, total
    
    @staticmethod
    def get_places_by_type(
        db: Session,
        place_type: str,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Place], int]:
        """
        Get places filtered by type
        
        Args:
            db: Database session
            place_type: Type of place (temple, mythology_spot, nature_spot)
            skip: Number of records to skip
            limit: Maximum records to return
            
        Returns:
            Tuple of (list of places, total count)
        """
        try:
            place_type_enum = PlaceType(place_type)
        except ValueError:
            return [], 0
        
        total = db.query(Place).filter(
            Place.place_type == place_type_enum
        ).count()
        
        places = db.query(Place).filter(
            Place.place_type == place_type_enum
        ).order_by(desc(Place.created_at)).offset(skip).limit(limit).all()
        
        return places, total
    
    @staticmethod
    def search_places(
        db: Session,
        query: str,
        skip: int = 0,
        limit: int = 50
    ) -> tuple[List[Place], int]:
        """
        Search places by name or description
        
        Args:
            db: Database session
            query: Search query string
            skip: Number of records to skip
            limit: Maximum records to return
            
        Returns:
            Tuple of (list of matching places, total count)
        """
        search_filter = Place.name.ilike(f"%{query}%") | \
                       Place.description.ilike(f"%{query}%")
        
        total = db.query(Place).filter(search_filter).count()
        places = db.query(Place).filter(search_filter).order_by(
            desc(Place.created_at)
        ).offset(skip).limit(limit).all()
        
        return places, total
    
    # ==================== UPDATE ====================
    
    @staticmethod
    def update_place(
        db: Session,
        place_id: int,
        place_data: UpdatePlaceRequest
    ) -> Optional[Place]:
        """
        Update an existing place
        
        Args:
            db: Database session
            place_id: Place ID to update
            place_data: Updated place data
            
        Returns:
            Updated Place object or None if not found
        """
        db_place = db.query(Place).filter(Place.id == place_id).first()
        if not db_place:
            return None
        
        update_data = place_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if value is not None:
                if field == "place_type":
                    value = PlaceType(value)
                setattr(db_place, field, value)
        
        db.commit()
        db.refresh(db_place)
        return db_place
    
    # ==================== DELETE ====================
    
    @staticmethod
    def delete_place(db: Session, place_id: int) -> bool:
        """
        Delete a place
        
        Args:
            db: Database session
            place_id: Place ID to delete
            
        Returns:
            True if deleted, False if not found
        """
        db_place = db.query(Place).filter(Place.id == place_id).first()
        if not db_place:
            return False
        
        db.delete(db_place)
        db.commit()
        return True
    
    # ==================== UTILITY ====================
    
    @staticmethod
    def get_place_types() -> List[str]:
        """
        Get list of valid place types
        
        Returns:
            List of place type values
        """
        return [place_type.value for place_type in PlaceType]
    
    @staticmethod
    def get_places_count_by_type(db: Session) -> dict:
        """
        Get count of places by type
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with place type counts
        """
        counts = {}
        for place_type in PlaceType:
            count = db.query(Place).filter(
                Place.place_type == place_type
            ).count()
            counts[place_type.value] = count
        
        return counts
