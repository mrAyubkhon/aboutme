"""
Journal schemas for Ayubi aka System API
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class JournalEntryBase(BaseModel):
    """Base journal entry schema"""
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    mood: Optional[str] = Field(None, max_length=20)
    weather: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    tags: Optional[str] = Field(None, max_length=500)
    category: str = Field(default="general", max_length=50)


class JournalEntryCreate(JournalEntryBase):
    """Schema for creating a journal entry"""
    is_private: bool = Field(default=True)
    is_favorite: bool = Field(default=False)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Great day at work",
                "content": "Had a productive day and learned new things...",
                "mood": "happy",
                "weather": "sunny",
                "location": "Office",
                "tags": "work,productivity,learning",
                "category": "work",
                "is_private": True,
                "is_favorite": False
            }
        }


class JournalEntryUpdate(BaseModel):
    """Schema for updating a journal entry"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    mood: Optional[str] = Field(None, max_length=20)
    weather: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    tags: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = Field(None, max_length=50)
    is_private: Optional[bool] = None
    is_favorite: Optional[bool] = None


class JournalEntryResponse(JournalEntryBase):
    """Schema for journal entry response"""
    id: int
    user_id: int
    is_private: bool
    is_favorite: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JournalEntrySearch(BaseModel):
    """Schema for journal entry search"""
    query: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    mood: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    is_favorite: Optional[bool] = None
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class JournalTemplateBase(BaseModel):
    """Base journal template schema"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    template_content: str = Field(..., min_length=1)


class JournalTemplateCreate(JournalTemplateBase):
    """Schema for creating a journal template"""
    is_default: bool = Field(default=False)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Daily Reflection",
                "description": "Template for daily reflection",
                "template_content": "## Today's Highlights\\n\\n## What I learned\\n\\n## Tomorrow's goals",
                "is_default": False
            }
        }


class JournalTemplateUpdate(BaseModel):
    """Schema for updating a journal template"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    template_content: Optional[str] = Field(None, min_length=1)
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None


class JournalTemplateResponse(JournalTemplateBase):
    """Schema for journal template response"""
    id: int
    user_id: int
    is_default: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JournalStats(BaseModel):
    """Schema for journal statistics"""
    total_entries: int
    entries_this_month: int
    entries_this_year: int
    favorite_entries: int
    most_used_tags: List[dict]
    mood_distribution: List[dict]
    writing_streak: int
    average_entry_length: float


class JournalDashboard(BaseModel):
    """Schema for journal dashboard data"""
    stats: JournalStats
    recent_entries: List[JournalEntryResponse]
    templates: List[JournalTemplateResponse]
    popular_tags: List[str]
