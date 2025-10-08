"""
Finance schemas for Ayubi aka System API
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class FinanceEntryBase(BaseModel):
    """Base finance entry schema"""
    amount: float = Field(..., gt=0, description="Amount in currency")
    transaction_type: str = Field(..., regex="^(income|expense)$")
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    tags: Optional[str] = Field(None, max_length=255)


class FinanceEntryCreate(FinanceEntryBase):
    """Schema for creating a finance entry"""
    entry_date: Optional[date] = None  # defaults to today
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 25.50,
                "transaction_type": "expense",
                "category": "Food",
                "description": "Lunch at restaurant",
                "payment_method": "card",
                "location": "Downtown Cafe",
                "tags": "food,restaurant"
            }
        }


class FinanceEntryUpdate(BaseModel):
    """Schema for updating a finance entry"""
    amount: Optional[float] = Field(None, gt=0)
    transaction_type: Optional[str] = Field(None, regex="^(income|expense)$")
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None
    payment_method: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    tags: Optional[str] = Field(None, max_length=255)


class FinanceEntryResponse(FinanceEntryBase):
    """Schema for finance entry response"""
    id: int
    user_id: int
    entry_date: date
    entry_time: datetime
    is_recurring: bool
    recurring_frequency: Optional[str]
    recurring_end_date: Optional[date]
    
    class Config:
        from_attributes = True


class FinanceCategoryBase(BaseModel):
    """Base finance category schema"""
    name: str = Field(..., min_length=1, max_length=100)
    category_type: str = Field(..., regex="^(income|expense)$")
    color: str = Field(default="#3b82f6", regex="^#[0-9a-fA-F]{6}$")
    icon: str = Field(default="💰", max_length=10)


class FinanceCategoryCreate(FinanceCategoryBase):
    """Schema for creating a finance category"""
    monthly_budget: Optional[float] = Field(None, ge=0)
    budget_warning_percentage: int = Field(default=80, ge=1, le=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Groceries",
                "category_type": "expense",
                "color": "#ef4444",
                "icon": "🛒",
                "monthly_budget": 500.0,
                "budget_warning_percentage": 80
            }
        }


class FinanceCategoryUpdate(BaseModel):
    """Schema for updating a finance category"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    color: Optional[str] = Field(None, regex="^#[0-9a-fA-F]{6}$")
    icon: Optional[str] = Field(None, max_length=10)
    monthly_budget: Optional[float] = Field(None, ge=0)
    budget_warning_percentage: Optional[int] = Field(None, ge=1, le=100)
    is_active: Optional[bool] = None


class FinanceCategoryResponse(FinanceCategoryBase):
    """Schema for finance category response"""
    id: int
    user_id: int
    is_default: bool
    is_active: bool
    monthly_budget: Optional[float]
    budget_warning_percentage: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class FinanceBudgetBase(BaseModel):
    """Base finance budget schema"""
    budget_year: int = Field(..., ge=2020, le=2030)
    budget_month: int = Field(..., ge=1, le=12)
    total_income: float = Field(default=0, ge=0)
    total_expenses: float = Field(default=0, ge=0)
    savings_goal: float = Field(default=0, ge=0)


class FinanceBudgetCreate(FinanceBudgetBase):
    """Schema for creating a finance budget"""
    
    class Config:
        json_schema_extra = {
            "example": {
                "budget_year": 2024,
                "budget_month": 1,
                "total_income": 5000.0,
                "total_expenses": 3000.0,
                "savings_goal": 1000.0
            }
        }


class FinanceBudgetResponse(FinanceBudgetBase):
    """Schema for finance budget response"""
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class FinanceStats(BaseModel):
    """Schema for finance statistics"""
    total_income: float
    total_expenses: float
    net_balance: float
    savings_rate: float
    monthly_budget_remaining: float
    top_categories: List[dict]
    recent_transactions: List[FinanceEntryResponse]


class FinanceSummary(BaseModel):
    """Schema for finance summary"""
    today: FinanceStats
    this_month: FinanceStats
    this_year: FinanceStats
    categories: List[FinanceCategoryResponse]
    current_budget: Optional[FinanceBudgetResponse]
