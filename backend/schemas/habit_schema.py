"""
Habit schemas for Ayubi aka System API
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class HabitBase(BaseModel):
    """Base habit schema"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    icon: str = Field(default="🎯", max_length=10)
    color: str = Field(default="blue", max_length=20)
    category: str = Field(default="personal", max_length=50)
    frequency: str = Field(default="daily", regex="^(daily|weekly|monthly)$")
    difficulty: str = Field(default="easy", regex="^(easy|medium|hard)$")
    target_count: int = Field(default=1, ge=1, le=10)


class HabitCreate(HabitBase):
    """Schema for creating a habit"""
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Drink Water",
                "description": "Stay hydrated throughout the day",
                "icon": "💧",
                "color": "blue",
                "category": "health",
                "frequency": "daily",
                "difficulty": "easy",
                "target_count": 1
            }
        }


class HabitUpdate(BaseModel):
    """Schema for updating a habit"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    icon: Optional[str] = Field(None, max_length=10)
    color: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(None, regex="^(daily|weekly|monthly)$")
    difficulty: Optional[str] = Field(None, regex="^(easy|medium|hard)$")
    target_count: Optional[int] = Field(None, ge=1, le=10)
    is_active: Optional[bool] = None
    is_paused: Optional[bool] = None


class HabitResponse(HabitBase):
    """Schema for habit response"""
    id: int
    user_id: int
    current_streak: int
    longest_streak: int
    total_completions: int
    is_active: bool
    is_paused: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class HabitCompletionBase(BaseModel):
    """Base habit completion schema"""
    completion_date: date
    notes: Optional[str] = None


class HabitCompletionCreate(HabitCompletionBase):
    """Schema for creating a habit completion"""
    
    class Config:
        json_schema_extra = {
            "example": {
                "completion_date": "2024-01-15",
                "notes": "Completed successfully!"
            }
        }


class HabitCompletionResponse(HabitCompletionBase):
    """Schema for habit completion response"""
    id: int
    habit_id: int
    user_id: int
    completion_time: datetime
    
    class Config:
        from_attributes = True


class HabitStats(BaseModel):
    """Schema for habit statistics"""
    total_habits: int
    active_habits: int
    completed_today: int
    total_completions: int
    average_streak: float
    longest_streak: int
    completion_rate: float


class HabitWithCompletions(HabitResponse):
    """Habit with completion history"""
    completions: List[HabitCompletionResponse] = []
