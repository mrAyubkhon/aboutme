"""
Pydantic schemas for Travel module
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


# Wishlist Schemas
class TravelWishlistBase(BaseModel):
    country_iso3: str = Field(..., min_length=3, max_length=3, description="ISO 3166-1 alpha-3 code")
    country_name: str = Field(..., min_length=1, max_length=255)
    continent: Optional[str] = Field(None, max_length=50)


class TravelWishlistCreate(TravelWishlistBase):
    pass


class TravelWishlistResponse(TravelWishlistBase):
    id: int
    user_id: int
    added_date: datetime
    
    class Config:
        from_attributes = True


# Visited Schemas
class TravelVisitedBase(BaseModel):
    country_iso3: str = Field(..., min_length=3, max_length=3)
    country_name: str = Field(..., min_length=1, max_length=255)
    visit_date: Optional[date] = None
    notes: Optional[str] = None


class TravelVisitedCreate(TravelVisitedBase):
    pass


class TravelVisitedResponse(TravelVisitedBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Stats Schemas
class TravelContinentStats(BaseModel):
    continent: str
    total_countries: int = 0
    wishlist_count: int = 0
    visited_count: int = 0


class TravelStatsResponse(BaseModel):
    total_wishlist: int = 0
    total_visited: int = 0
    continents: List[TravelContinentStats] = []
    wishlist_countries: List[str] = []
    visited_countries: List[str] = []


class TravelDashboardResponse(BaseModel):
    stats: TravelStatsResponse
    recent_wishlist: List[TravelWishlistResponse] = []
    recent_visited: List[TravelVisitedResponse] = []

