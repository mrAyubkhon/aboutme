"""
Pydantic schemas for Sport/Fitness module
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import date, datetime


# Water Schemas
class SportWaterBase(BaseModel):
    date: date
    ml: int = Field(..., gt=0, le=10000, description="Water amount in ml")


class SportWaterCreate(SportWaterBase):
    pass


class SportWaterResponse(SportWaterBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Food Schemas
class SportFoodBase(BaseModel):
    date: date
    name: str = Field(..., min_length=1, max_length=255)
    kcal: int = Field(..., ge=0, le=10000)
    protein: Optional[float] = Field(None, ge=0)
    carbs: Optional[float] = Field(None, ge=0)
    fat: Optional[float] = Field(None, ge=0)


class SportFoodCreate(SportFoodBase):
    pass


class SportFoodResponse(SportFoodBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Workout Schemas
class SportWorkoutBase(BaseModel):
    date: date
    name: str = Field(..., min_length=1, max_length=255)
    duration_min: int = Field(..., gt=0, le=1440)  # Max 24 hours
    kcal_burned: int = Field(..., ge=0, le=10000)


class SportWorkoutCreate(SportWorkoutBase):
    pass


class SportWorkoutResponse(SportWorkoutBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Goals Schemas
class SportGoalsBase(BaseModel):
    water_ml_per_day: int = Field(default=3000, ge=500, le=10000)
    kcal_per_day: int = Field(default=2200, ge=1000, le=5000)


class SportGoalsUpdate(SportGoalsBase):
    pass


class SportGoalsResponse(SportGoalsBase):
    id: int
    user_id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Stats Schemas
class SportDailyStats(BaseModel):
    date: date
    water_ml: int = 0
    kcal_intake: int = 0
    kcal_burned: int = 0
    net_kcal: int = 0
    foods_count: int = 0
    workouts_count: int = 0


class SportWeeklyStats(BaseModel):
    start_date: date
    end_date: date
    total_water_ml: int = 0
    avg_water_ml: int = 0
    total_kcal_intake: int = 0
    avg_kcal_intake: int = 0
    total_kcal_burned: int = 0
    avg_kcal_burned: int = 0
    daily_stats: List[SportDailyStats] = []


class SportOverviewResponse(BaseModel):
    today: SportDailyStats
    goals: SportGoalsResponse
    this_week: SportWeeklyStats

