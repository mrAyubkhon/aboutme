"""
Travel API routes for Ayubi aka System
Handles travel wishlist and visited countries
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from models.user import User
from models.travel import TravelWishlist, TravelVisited
from schemas.travel_schema import (
    TravelWishlistCreate, TravelWishlistResponse,
    TravelVisitedCreate, TravelVisitedResponse,
    TravelStatsResponse, TravelDashboardResponse,
    TravelContinentStats
)
from routes.auth import get_current_active_user

router = APIRouter(prefix="/travel", tags=["travel"])


# Wishlist Endpoints
@router.post("/wishlist", response_model=TravelWishlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    wishlist_data: TravelWishlistCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add country to travel wishlist"""
    # Check if already in wishlist
    existing = db.query(TravelWishlist).filter(
        TravelWishlist.user_id == current_user.id,
        TravelWishlist.country_iso3 == wishlist_data.country_iso3
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Country already in wishlist"
        )
    
    wishlist_entry = TravelWishlist(
        user_id=current_user.id,
        **wishlist_data.dict()
    )
    db.add(wishlist_entry)
    db.commit()
    db.refresh(wishlist_entry)
    return wishlist_entry


@router.get("/wishlist", response_model=List[TravelWishlistResponse])
async def get_wishlist(
    continent: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get travel wishlist"""
    query = db.query(TravelWishlist).filter(TravelWishlist.user_id == current_user.id)
    
    if continent:
        query = query.filter(TravelWishlist.continent == continent)
    
    return query.order_by(TravelWishlist.added_date.desc()).all()


@router.delete("/wishlist/{iso3}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    iso3: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove country from wishlist"""
    wishlist = db.query(TravelWishlist).filter(
        TravelWishlist.user_id == current_user.id,
        TravelWishlist.country_iso3 == iso3.upper()
    ).first()
    
    if not wishlist:
        raise HTTPException(status_code=404, detail="Country not found in wishlist")
    
    db.delete(wishlist)
    db.commit()
    return None


# Visited Countries Endpoints
@router.post("/visited", response_model=TravelVisitedResponse, status_code=status.HTTP_201_CREATED)
async def add_visited_country(
    visited_data: TravelVisitedCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mark country as visited"""
    # Check if already marked as visited
    existing = db.query(TravelVisited).filter(
        TravelVisited.user_id == current_user.id,
        TravelVisited.country_iso3 == visited_data.country_iso3
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Country already marked as visited"
        )
    
    visited_entry = TravelVisited(
        user_id=current_user.id,
        **visited_data.dict()
    )
    db.add(visited_entry)
    db.commit()
    db.refresh(visited_entry)
    
    # Remove from wishlist if present
    wishlist = db.query(TravelWishlist).filter(
        TravelWishlist.user_id == current_user.id,
        TravelWishlist.country_iso3 == visited_data.country_iso3
    ).first()
    if wishlist:
        db.delete(wishlist)
        db.commit()
    
    return visited_entry


@router.get("/visited", response_model=List[TravelVisitedResponse])
async def get_visited_countries(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get list of visited countries"""
    return db.query(TravelVisited).filter(
        TravelVisited.user_id == current_user.id
    ).order_by(TravelVisited.visit_date.desc()).all()


@router.delete("/visited/{iso3}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_visited_country(
    iso3: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove country from visited list"""
    visited = db.query(TravelVisited).filter(
        TravelVisited.user_id == current_user.id,
        TravelVisited.country_iso3 == iso3.upper()
    ).first()
    
    if not visited:
        raise HTTPException(status_code=404, detail="Country not found in visited list")
    
    db.delete(visited)
    db.commit()
    return None


# Statistics Endpoints
@router.get("/stats", response_model=TravelStatsResponse)
async def get_travel_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get travel statistics"""
    # Get wishlist
    wishlist = db.query(TravelWishlist).filter(
        TravelWishlist.user_id == current_user.id
    ).all()
    
    # Get visited
    visited = db.query(TravelVisited).filter(
        TravelVisited.user_id == current_user.id
    ).all()
    
    # Calculate continent stats
    continent_stats = {}
    for item in wishlist:
        continent = item.continent or "Unknown"
        if continent not in continent_stats:
            continent_stats[continent] = {"wishlist": 0, "visited": 0}
        continent_stats[continent]["wishlist"] += 1
    
    for item in visited:
        # Get continent from country name (would need a lookup table in production)
        continent = "Unknown"
        if continent not in continent_stats:
            continent_stats[continent] = {"wishlist": 0, "visited": 0}
        continent_stats[continent]["visited"] += 1
    
    continents = [
        TravelContinentStats(
            continent=cont,
            total_countries=0,  # Would need full country list
            wishlist_count=stats["wishlist"],
            visited_count=stats["visited"]
        )
        for cont, stats in continent_stats.items()
    ]
    
    return TravelStatsResponse(
        total_wishlist=len(wishlist),
        total_visited=len(visited),
        continents=continents,
        wishlist_countries=[w.country_name for w in wishlist],
        visited_countries=[v.country_name for v in visited]
    )


@router.get("/dashboard", response_model=TravelDashboardResponse)
async def get_travel_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get complete travel dashboard"""
    stats = await get_travel_stats(current_user, db)
    
    recent_wishlist = db.query(TravelWishlist).filter(
        TravelWishlist.user_id == current_user.id
    ).order_by(TravelWishlist.added_date.desc()).limit(5).all()
    
    recent_visited = db.query(TravelVisited).filter(
        TravelVisited.user_id == current_user.id
    ).order_by(TravelVisited.created_at.desc()).limit(5).all()
    
    return TravelDashboardResponse(
        stats=stats,
        recent_wishlist=recent_wishlist,
        recent_visited=recent_visited
    )

