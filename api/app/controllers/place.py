# Place Controller
"""
PlaceController handles HTTP requests for place endpoints.
All business logic is delegated to PlaceService.

CRUD endpoints for temples, mythology spots, and nature spots.
"""

from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.schemas.place import (
    CreatePlaceRequest,
    UpdatePlaceRequest,
    PlaceResponse,
    PlaceListResponse,
    CreatePlaceResponse,
    UpdatePlaceResponse,
    DeletePlaceResponse,
    PlacesByTypeResponse
)
from app.services.place import PlaceService
from app.database.session import get_db
from sqlalchemy.orm import Session

# Create router for place endpoints
router = APIRouter(prefix="/api/v1/places", tags=["Places"])


# ==================== CREATE ====================

@router.post(
    "",
    response_model=CreatePlaceResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Place created successfully"},
        400: {"description": "Invalid input"},
        422: {"description": "Validation error"}
    }
)
async def create_place(
    request: CreatePlaceRequest,
    db: Session = Depends(get_db)
) -> CreatePlaceResponse:
    """
    Create a new place (temple, mythology spot, or nature spot)
    
    - **name**: Place name (required)
    - **place_type**: temple, mythology_spot, or nature_spot (required)
    - **description**: Optional detailed description
    - **latitude**: Optional GPS latitude
    - **longitude**: Optional GPS longitude
    - **address**: Optional physical address
    """
    try:
        place = PlaceService.create_place(db, request)
        return CreatePlaceResponse(
            message="Place created successfully",
            place=PlaceResponse.model_validate(place)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create place: {str(e)}"
        )


# ==================== READ ====================

@router.get(
    "",
    response_model=PlaceListResponse,
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "List of places retrieved successfully"}}
)
async def get_all_places(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=100, description="Maximum records to return"),
    search: str = Query(None, description="Search by name or description"),
    db: Session = Depends(get_db)
) -> PlaceListResponse:
    """
    Get all places with optional search and pagination
    
    - **skip**: Pagination offset (default: 0)
    - **limit**: Number of results to return (default: 50, max: 100)
    - **search**: Search query (optional)
    """
    try:
        if search:
            places, total = PlaceService.search_places(db, search, skip, limit)
        else:
            places, total = PlaceService.get_all_places(db, skip, limit)
        
        return PlaceListResponse(
            total=total,
            count=len(places),
            places=[PlaceResponse.model_validate(p) for p in places]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve places: {str(e)}"
        )


@router.get(
    "/{place_id}",
    response_model=PlaceResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Place retrieved successfully"},
        404: {"description": "Place not found"}
    }
)
async def get_place(
    place_id: int,
    db: Session = Depends(get_db)
) -> PlaceResponse:
    """
    Get a specific place by ID
    
    - **place_id**: Place ID (path parameter)
    """
    place = PlaceService.get_place_by_id(db, place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place with ID {place_id} not found"
        )
    return PlaceResponse.model_validate(place)


@router.get(
    "/type/{place_type}",
    response_model=PlacesByTypeResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Places of type retrieved successfully"},
        400: {"description": "Invalid place type"}
    }
)
async def get_places_by_type(
    place_type: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
) -> PlacesByTypeResponse:
    """
    Get places filtered by type
    
    - **place_type**: Type filter (temple, mythology_spot, nature_spot)
    - **skip**: Pagination offset
    - **limit**: Number of results to return
    """
    valid_types = PlaceService.get_place_types()
    if place_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid place type. Must be one of: {', '.join(valid_types)}"
        )
    
    try:
        places, total = PlaceService.get_places_by_type(db, place_type, skip, limit)
        return PlacesByTypeResponse(
            place_type=place_type,
            total=total,
            count=len(places),
            places=[PlaceResponse.model_validate(p) for p in places]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve places: {str(e)}"
        )


# ==================== UPDATE ====================

@router.put(
    "/{place_id}",
    response_model=UpdatePlaceResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Place updated successfully"},
        404: {"description": "Place not found"},
        400: {"description": "Invalid update data"}
    }
)
async def update_place(
    place_id: int,
    request: UpdatePlaceRequest,
    db: Session = Depends(get_db)
) -> UpdatePlaceResponse:
    """
    Update a place
    
    - **place_id**: Place ID to update
    - **request body**: Fields to update (all optional)
    """
    place = PlaceService.update_place(db, place_id, request)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place with ID {place_id} not found"
        )
    
    return UpdatePlaceResponse(
        message="Place updated successfully",
        place=PlaceResponse.model_validate(place)
    )


# ==================== DELETE ====================

@router.delete(
    "/{place_id}",
    response_model=DeletePlaceResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Place deleted successfully"},
        404: {"description": "Place not found"}
    }
)
async def delete_place(
    place_id: int,
    db: Session = Depends(get_db)
) -> DeletePlaceResponse:
    """
    Delete a place
    
    - **place_id**: Place ID to delete
    """
    success = PlaceService.delete_place(db, place_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place with ID {place_id} not found"
        )
    
    return DeletePlaceResponse(
        message="Place deleted successfully",
        place_id=place_id
    )


# ==================== UTILITY ====================

@router.get(
    "/stats/types",
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "Place type statistics retrieved"}}
)
async def get_place_type_stats(db: Session = Depends(get_db)):
    """
    Get statistics of places by type
    """
    try:
        counts = PlaceService.get_places_count_by_type(db)
        return {
            "message": "Place type statistics",
            "stats": counts,
            "total": sum(counts.values())
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )
