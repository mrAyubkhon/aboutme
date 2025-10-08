"""
Water tracking schemas for Ayubi aka System API
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class WaterEntryBase(BaseModel):
    """Base water entry schema"""
    amount: int = Field(..., ge=1, le=5000, description="Amount in milliliters")
    drink_type: str = Field(default="water", max_length=50)
    temperature: str = Field(default="room", regex="^(cold|room|warm|hot)$")
    notes: Optional[str] = Field(None, max_length=255)


class WaterEntryCreate(WaterEntryBase):
    """Schema for creating a water entry"""
    entry_date: Optional[date] = None  # defaults to today
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 250,
                "drink_type": "water",
                "temperature": "room",
                "notes": "After workout"
            }
        }


class WaterEntryUpdate(BaseModel):
    """Schema for updating a water entry"""
    amount: Optional[int] = Field(None, ge=1, le=5000)
    drink_type: Optional[str] = Field(None, max_length=50)
    temperature: Optional[str] = Field(None, regex="^(cold|room|warm|hot)$")
    notes: Optional[str] = Field(None, max_length=255)


class WaterEntryResponse(WaterEntryBase):
    """Schema for water entry response"""
    id: int
    user_id: int
    entry_date: date
    entry_time: datetime
    
    class Config:
        from_attributes = True


class WaterGoalBase(BaseModel):
    """Base water goal schema"""
    daily_goal: int = Field(default=2500, ge=500, le=10000)
    glass_size: int = Field(default=250, ge=50, le=1000)
    reminder_enabled: bool = Field(default=True)
    reminder_interval: int = Field(default=120, ge=30, le=480)  # minutes
    reminder_start_time: str = Field(default="08:00", regex="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    reminder_end_time: str = Field(default="22:00", regex="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")


class WaterGoalCreate(WaterGoalBase):
    """Schema for creating water goals"""
    
    class Config:
        json_schema_extra = {
            "example": {
                "daily_goal": 3000,
                "glass_size": 300,
                "reminder_enabled": True,
                "reminder_interval": 120,
                "reminder_start_time": "08:00",
                "reminder_end_time": "22:00"
            }
        }


class WaterGoalUpdate(BaseModel):
    """Schema for updating water goals"""
    daily_goal: Optional[int] = Field(None, ge=500, le=10000)
    glass_size: Optional[int] = Field(None, ge=50, le=1000)
    reminder_enabled: Optional[bool] = None
    reminder_interval: Optional[int] = Field(None, ge=30, le=480)
    reminder_start_time: Optional[str] = Field(None, regex="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")
    reminder_end_time: Optional[str] = Field(None, regex="^([01]?[0-9]|2[0-3]):[0-5][0-9]$")


class WaterGoalResponse(WaterGoalBase):
    """Schema for water goal response"""
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class WaterStats(BaseModel):
    """Schema for water statistics"""
    today_total: int
    daily_goal: int
    progress_percentage: float
    entries_today: int
    average_per_entry: float
    remaining_to_goal: int
    streak_days: int
    weekly_average: float


class WaterHistory(BaseModel):
    """Schema for water history"""
    date: date
    total_amount: int
    entries_count: int
    goal_met: bool


class WaterDashboard(BaseModel):
    """Schema for water dashboard data"""
    stats: WaterStats
    goal: WaterGoalResponse
    recent_entries: List[WaterEntryResponse]
    weekly_history: List[WaterHistory]
