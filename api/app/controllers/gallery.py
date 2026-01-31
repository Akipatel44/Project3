# Gallery controller with CRUD endpoints
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.gallery import GalleryService
from app.models.gallery import GalleryCategory
from app.schemas.gallery import (
    CreateGalleryRequest,
    UpdateGalleryRequest,
    GalleryResponse,
    GalleryCategoryResponse,
    GalleryCategoryStatsResponse,
    GalleryRecentResponse
)
from typing import List


gallery_router = APIRouter(prefix="/api/v1/gallery", tags=["Gallery"])


@gallery_router.post(
    "",
    response_model=GalleryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add image to gallery"
)
def create_gallery(
    request: CreateGalleryRequest,
    db: Session = Depends(get_db)
):
    """Add a new image to gallery with metadata"""
    try:
        category = GalleryCategory(request.category)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {[e.value for e in GalleryCategory]}"
        )
    
    gallery = GalleryService.create_gallery(
        db=db,
        category=category,
        image_url=request.image_url,
        title=request.title,
        description=request.description,
        alt_text=request.alt_text,
        width=request.width,
        height=request.height,
        file_size=request.file_size,
        mime_type=request.mime_type
    )
    return gallery


@gallery_router.get(
    "",
    response_model=List[GalleryResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all gallery entries"
)
def get_all_gallery(
    skip: int = Query(0, ge=0, description="Skip records"),
    limit: int = Query(100, ge=1, le=1000, description="Limit records"),
    active_only: bool = Query(True, description="Show only active entries"),
    search: str = Query(None, description="Search by title, description, or alt text"),
    db: Session = Depends(get_db)
):
    """Retrieve all gallery entries with optional search and filtering"""
    if search:
        return GalleryService.search_gallery(db, search, skip, limit)
    
    return GalleryService.get_all_gallery(db, skip, limit, active_only)


@gallery_router.get(
    "/recent",
    response_model=GalleryRecentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get recent gallery entries"
)
def get_recent_gallery(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve most recent active gallery entries"""
    entries = GalleryService.get_recent_gallery(db, limit)
    return {
        "entries": entries,
        "total_count": len(entries)
    }


@gallery_router.get(
    "/category/{category}",
    response_model=GalleryCategoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get gallery by category"
)
def get_gallery_by_category(
    category: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Retrieve gallery entries filtered by category"""
    try:
        category_enum = GalleryCategory(category)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {[e.value for e in GalleryCategory]}"
        )
    
    entries, total_count = GalleryService.get_gallery_by_category_paginated(
        db, category_enum, skip, limit
    )
    return {
        "category": category,
        "entries": entries,
        "total_count": total_count
    }


@gallery_router.get(
    "/stats/categories",
    response_model=GalleryCategoryStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get gallery statistics"
)
def get_gallery_stats(db: Session = Depends(get_db)):
    """Get count of gallery entries by category"""
    counts = GalleryService.get_category_count(db)
    return {
        "temple": counts.get("temple", 0),
        "mythology": counts.get("mythology", 0),
        "nature": counts.get("nature", 0),
        "cultural": counts.get("cultural", 0),
        "festival": counts.get("festival", 0),
        "monument": counts.get("monument", 0),
        "other": counts.get("other", 0)
    }


@gallery_router.get(
    "/{gallery_id}",
    response_model=GalleryResponse,
    status_code=status.HTTP_200_OK,
    summary="Get gallery entry by ID"
)
def get_gallery(
    gallery_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve a specific gallery entry by ID"""
    gallery = GalleryService.get_gallery_by_id(db, gallery_id)
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery entry not found"
        )
    return gallery


@gallery_router.put(
    "/{gallery_id}",
    response_model=GalleryResponse,
    status_code=status.HTTP_200_OK,
    summary="Update gallery entry"
)
def update_gallery(
    gallery_id: int,
    request: UpdateGalleryRequest,
    db: Session = Depends(get_db)
):
    """Update a gallery entry with partial fields"""
    gallery = GalleryService.get_gallery_by_id(db, gallery_id)
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery entry not found"
        )
    
    category = None
    if request.category:
        try:
            category = GalleryCategory(request.category)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid category. Must be one of: {[e.value for e in GalleryCategory]}"
            )
    
    updated_gallery = GalleryService.update_gallery(
        db=db,
        gallery_id=gallery_id,
        category=category,
        image_url=request.image_url,
        title=request.title,
        description=request.description,
        alt_text=request.alt_text,
        width=request.width,
        height=request.height,
        file_size=request.file_size,
        mime_type=request.mime_type,
        is_active=request.is_active
    )
    return updated_gallery


@gallery_router.delete(
    "/{gallery_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete gallery entry"
)
def delete_gallery(
    gallery_id: int,
    db: Session = Depends(get_db)
):
    """Delete a gallery entry"""
    gallery = GalleryService.get_gallery_by_id(db, gallery_id)
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery entry not found"
        )
    
    GalleryService.delete_gallery(db, gallery_id)
    return None


@gallery_router.patch(
    "/{gallery_id}/toggle-status",
    response_model=GalleryResponse,
    status_code=status.HTTP_200_OK,
    summary="Toggle gallery entry status"
)
def toggle_gallery_status(
    gallery_id: int,
    db: Session = Depends(get_db)
):
    """Toggle gallery entry active/inactive status"""
    gallery = GalleryService.get_gallery_by_id(db, gallery_id)
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery entry not found"
        )
    
    updated_gallery = GalleryService.toggle_gallery_status(db, gallery_id)
    return updated_gallery
