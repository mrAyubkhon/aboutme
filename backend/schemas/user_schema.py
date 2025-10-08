"""
User schemas for Ayubi aka System API
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: Optional[str] = Field(None, max_length=200)


class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(..., min_length=8, max_length=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "ayubi",
                "full_name": "Ayubi User",
                "password": "securepassword123"
            }
        }


class UserUpdate(BaseModel):
    """Schema for user updates"""
    full_name: Optional[str] = Field(None, max_length=200)
    timezone: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, regex="^(dark|light|auto)$")
    language: Optional[str] = Field(None, max_length=10)
    daily_water_goal: Optional[int] = Field(None, ge=500, le=10000)
    daily_habits_reminder: Optional[bool] = None
    finance_budget_limit: Optional[int] = Field(None, ge=0)


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    is_verified: bool
    timezone: str
    theme: str
    language: str
    daily_water_goal: int
    daily_habits_reminder: bool
    finance_budget_limit: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


class UserProfile(UserResponse):
    """Extended user profile with statistics"""
    total_habits: int = 0
    active_habits: int = 0
    total_water_today: int = 0
    total_entries_this_month: int = 0
    journal_entries_count: int = 0


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "ayubi",
                "password": "securepassword123"
            }
        }


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class TokenData(BaseModel):
    """Token data for authentication"""
    username: Optional[str] = None
    user_id: Optional[int] = None
