# Gallery service for CRUD operations and metadata management
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.gallery import Gallery, GalleryCategory
from datetime import datetime


class GalleryService:
    """Service layer for Gallery operations"""
    
    @staticmethod
    def create_gallery(
        db: Session,
        category: GalleryCategory,
        image_url: str,
        title: str,
        description: str = None,
        alt_text: str = None,
        width: int = None,
        height: int = None,
        file_size: int = None,
        mime_type: str = None
    ) -> Gallery:
        """Create a new gallery entry with image metadata"""
        gallery = Gallery(
            category=category,
            image_url=image_url,
            title=title,
            description=description,
            alt_text=alt_text,
            width=width,
            height=height,
            file_size=file_size,
            mime_type=mime_type
        )
        db.add(gallery)
        db.commit()
        db.refresh(gallery)
        return gallery
    
    @staticmethod
    def get_gallery_by_id(db: Session, gallery_id: int) -> Gallery:
        """Retrieve gallery entry by ID"""
        return db.query(Gallery).filter(Gallery.id == gallery_id).first()
    
    @staticmethod
    def get_all_gallery(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = False
    ) -> list[Gallery]:
        """Retrieve all gallery entries with pagination"""
        query = db.query(Gallery)
        
        if active_only:
            query = query.filter(Gallery.is_active == True)
        
        return query.order_by(Gallery.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_gallery_by_category(
        db: Session,
        category: GalleryCategory,
        skip: int = 0,
        limit: int = 100
    ) -> list[Gallery]:
        """Retrieve gallery entries filtered by category"""
        return (
            db.query(Gallery)
            .filter(Gallery.category == category)
            .order_by(Gallery.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def search_gallery(
        db: Session,
        query_text: str,
        skip: int = 0,
        limit: int = 100
    ) -> list[Gallery]:
        """Search gallery by title, description, or alt_text"""
        search_term = f"%{query_text}%"
        return (
            db.query(Gallery)
            .filter(
                or_(
                    Gallery.title.ilike(search_term),
                    Gallery.description.ilike(search_term),
                    Gallery.alt_text.ilike(search_term)
                )
            )
            .order_by(Gallery.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_recent_gallery(
        db: Session,
        limit: int = 20
    ) -> list[Gallery]:
        """Retrieve most recent active gallery entries"""
        return (
            db.query(Gallery)
            .filter(Gallery.is_active == True)
            .order_by(Gallery.created_at.desc())
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_gallery_by_category_paginated(
        db: Session,
        category: GalleryCategory,
        skip: int = 0,
        limit: int = 100,
        active_only: bool = True
    ) -> tuple[list[Gallery], int]:
        """Retrieve gallery by category with total count"""
        query = db.query(Gallery).filter(Gallery.category == category)
        
        if active_only:
            query = query.filter(Gallery.is_active == True)
        
        total_count = query.count()
        galleries = query.order_by(Gallery.created_at.desc()).offset(skip).limit(limit).all()
        
        return galleries, total_count
    
    @staticmethod
    def update_gallery(
        db: Session,
        gallery_id: int,
        category: GalleryCategory = None,
        image_url: str = None,
        title: str = None,
        description: str = None,
        alt_text: str = None,
        width: int = None,
        height: int = None,
        file_size: int = None,
        mime_type: str = None,
        is_active: bool = None
    ) -> Gallery:
        """Update gallery entry with partial fields"""
        gallery = GalleryService.get_gallery_by_id(db, gallery_id)
        if not gallery:
            return None
        
        if category is not None:
            gallery.category = category
        if image_url is not None:
            gallery.image_url = image_url
        if title is not None:
            gallery.title = title
        if description is not None:
            gallery.description = description
        if alt_text is not None:
            gallery.alt_text = alt_text
        if width is not None:
            gallery.width = width
        if height is not None:
            gallery.height = height
        if file_size is not None:
            gallery.file_size = file_size
        if mime_type is not None:
            gallery.mime_type = mime_type
        if is_active is not None:
            gallery.is_active = is_active
        
        db.commit()
        db.refresh(gallery)
        return gallery
    
    @staticmethod
    def delete_gallery(db: Session, gallery_id: int) -> bool:
        """Delete a gallery entry"""
        gallery = GalleryService.get_gallery_by_id(db, gallery_id)
        if not gallery:
            return False
        
        db.delete(gallery)
        db.commit()
        return True
    
    @staticmethod
    def toggle_gallery_status(db: Session, gallery_id: int) -> Gallery:
        """Toggle gallery entry active/inactive status"""
        gallery = GalleryService.get_gallery_by_id(db, gallery_id)
        if not gallery:
            return None
        
        gallery.is_active = not gallery.is_active
        db.commit()
        db.refresh(gallery)
        return gallery
    
    @staticmethod
    def get_category_count(db: Session) -> dict:
        """Get count of gallery entries by category"""
        counts = {}
        for category in GalleryCategory:
            count = db.query(Gallery).filter(Gallery.category == category).count()
            counts[category.value] = count
        return counts
    
    @staticmethod
    def get_total_file_size(db: Session, category: GalleryCategory = None) -> int:
        """Get total file size in bytes for gallery entries"""
        query = db.query(Gallery).filter(Gallery.file_size.isnot(None))
        
        if category:
            query = query.filter(Gallery.category == category)
        
        total = 0
        for gallery in query.all():
            if gallery.file_size:
                total += gallery.file_size
        
        return total
