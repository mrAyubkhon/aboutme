"""
Finance routes for Ayubi aka System
"""
from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from database import get_db
from models.user import User
from models.finance import FinanceEntry, FinanceCategory, FinanceBudget
from schemas.finance_schema import (
    FinanceEntryCreate, FinanceEntryUpdate, FinanceEntryResponse,
    FinanceCategoryCreate, FinanceCategoryUpdate, FinanceCategoryResponse,
    FinanceBudgetCreate, FinanceBudgetResponse, FinanceStats, FinanceSummary
)
from utils.auth import get_current_active_user
from utils.helpers import get_today, get_date_range, format_currency
from utils.logger import log_user_action

router = APIRouter(prefix="/finance", tags=["Finance"])


@router.get("/entries", response_model=List[FinanceEntryResponse])
async def get_finance_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    transaction_type: Optional[str] = Query(None, regex="^(income|expense)$"),
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's finance entries with filters
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        transaction_type: Filter by transaction type
        category: Filter by category
        start_date: Filter entries from this date
        end_date: Filter entries to this date
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[FinanceEntryResponse]: List of finance entries
    """
    query = db.query(FinanceEntry).filter(FinanceEntry.user_id == current_user.id)
    
    if transaction_type:
        query = query.filter(FinanceEntry.transaction_type == transaction_type)
    
    if category:
        query = query.filter(FinanceEntry.category == category)
    
    if start_date:
        query = query.filter(FinanceEntry.entry_date >= start_date)
    
    if end_date:
        query = query.filter(FinanceEntry.entry_date <= end_date)
    
    entries = query.order_by(desc(FinanceEntry.entry_time)).offset(skip).limit(limit).all()
    
    log_user_action("read", current_user.id, "finance_entries", None)
    
    return entries


@router.post("/entries", response_model=FinanceEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_finance_entry(
    entry_data: FinanceEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new finance entry
    
    Args:
        entry_data: Finance entry data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceEntryResponse: Created finance entry
    """
    # Use today's date if not specified
    entry_date = entry_data.entry_date or get_today()
    
    new_entry = FinanceEntry(
        user_id=current_user.id,
        entry_date=entry_date,
        **entry_data.dict(exclude={"entry_date"})
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    log_user_action(
        "create", 
        current_user.id, 
        "finance_entry", 
        new_entry.id, 
        {
            "amount": entry_data.amount,
            "type": entry_data.transaction_type,
            "category": entry_data.category
        }
    )
    
    return new_entry


@router.get("/entries/{entry_id}", response_model=FinanceEntryResponse)
async def get_finance_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific finance entry
    
    Args:
        entry_id: Finance entry ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceEntryResponse: Finance entry
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(FinanceEntry).filter(
        FinanceEntry.id == entry_id,
        FinanceEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance entry not found"
        )
    
    log_user_action("read", current_user.id, "finance_entry", entry_id)
    
    return entry


@router.put("/entries/{entry_id}", response_model=FinanceEntryResponse)
async def update_finance_entry(
    entry_id: int,
    entry_update: FinanceEntryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a finance entry
    
    Args:
        entry_id: Finance entry ID
        entry_update: Finance entry update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceEntryResponse: Updated finance entry
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(FinanceEntry).filter(
        FinanceEntry.id == entry_id,
        FinanceEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance entry not found"
        )
    
    # Update entry fields
    update_data = entry_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    db.commit()
    db.refresh(entry)
    
    log_user_action("update", current_user.id, "finance_entry", entry_id, {"fields": list(update_data.keys())})
    
    return entry


@router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_finance_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a finance entry
    
    Args:
        entry_id: Finance entry ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(FinanceEntry).filter(
        FinanceEntry.id == entry_id,
        FinanceEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finance entry not found"
        )
    
    db.delete(entry)
    db.commit()
    
    log_user_action("delete", current_user.id, "finance_entry", entry_id)


@router.get("/categories", response_model=List[FinanceCategoryResponse])
async def get_finance_categories(
    category_type: Optional[str] = Query(None, regex="^(income|expense)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's finance categories
    
    Args:
        category_type: Filter by category type
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[FinanceCategoryResponse]: List of finance categories
    """
    query = db.query(FinanceCategory).filter(FinanceCategory.user_id == current_user.id)
    
    if category_type:
        query = query.filter(FinanceCategory.category_type == category_type)
    
    categories = query.filter(FinanceCategory.is_active == True).all()
    
    return categories


@router.post("/categories", response_model=FinanceCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_finance_category(
    category_data: FinanceCategoryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new finance category
    
    Args:
        category_data: Finance category data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceCategoryResponse: Created finance category
    """
    new_category = FinanceCategory(
        user_id=current_user.id,
        **category_data.dict()
    )
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    log_user_action("create", current_user.id, "finance_category", new_category.id, {"name": category_data.name})
    
    return new_category


@router.get("/stats/summary", response_model=FinanceSummary)
async def get_finance_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive finance summary
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceSummary: Complete finance summary
    """
    today = get_today()
    
    # Today's stats
    today_entries = db.query(FinanceEntry).filter(
        FinanceEntry.user_id == current_user.id,
        FinanceEntry.entry_date == today
    ).all()
    
    today_income = sum(e.amount for e in today_entries if e.transaction_type == "income")
    today_expenses = sum(e.amount for e in today_entries if e.transaction_type == "expense")
    today_balance = today_income - today_expenses
    
    # This month's stats
    month_start, month_end = get_date_range("month")
    month_entries = db.query(FinanceEntry).filter(
        FinanceEntry.user_id == current_user.id,
        FinanceEntry.entry_date >= month_start,
        FinanceEntry.entry_date <= month_end
    ).all()
    
    month_income = sum(e.amount for e in month_entries if e.transaction_type == "income")
    month_expenses = sum(e.amount for e in month_entries if e.transaction_type == "expense")
    month_balance = month_income - month_expenses
    
    # This year's stats
    year_start, year_end = get_date_range("year")
    year_entries = db.query(FinanceEntry).filter(
        FinanceEntry.user_id == current_user.id,
        FinanceEntry.entry_date >= year_start,
        FinanceEntry.entry_date <= year_end
    ).all()
    
    year_income = sum(e.amount for e in year_entries if e.transaction_type == "income")
    year_expenses = sum(e.amount for e in year_entries if e.transaction_type == "expense")
    year_balance = year_income - year_expenses
    
    # Get top categories
    category_stats = db.query(
        FinanceEntry.category,
        FinanceEntry.transaction_type,
        func.sum(FinanceEntry.amount).label('total_amount'),
        func.count(FinanceEntry.id).label('count')
    ).filter(
        FinanceEntry.user_id == current_user.id,
        FinanceEntry.entry_date >= month_start
    ).group_by(
        FinanceEntry.category,
        FinanceEntry.transaction_type
    ).order_by(desc('total_amount')).limit(5).all()
    
    top_categories = [
        {
            "category": stat.category,
            "type": stat.transaction_type,
            "total_amount": float(stat.total_amount),
            "count": stat.count
        }
        for stat in category_stats
    ]
    
    # Get recent transactions
    recent_transactions = db.query(FinanceEntry).filter(
        FinanceEntry.user_id == current_user.id
    ).order_by(desc(FinanceEntry.entry_time)).limit(10).all()
    
    # Get categories
    categories = db.query(FinanceCategory).filter(
        FinanceCategory.user_id == current_user.id,
        FinanceCategory.is_active == True
    ).all()
    
    # Get current budget
    current_budget = db.query(FinanceBudget).filter(
        FinanceBudget.user_id == current_user.id,
        FinanceBudget.budget_year == today.year,
        FinanceBudget.budget_month == today.month,
        FinanceBudget.is_active == True
    ).first()
    
    # Calculate savings rates
    today_savings_rate = (today_balance / today_income * 100) if today_income > 0 else 0
    month_savings_rate = (month_balance / month_income * 100) if month_income > 0 else 0
    year_savings_rate = (year_balance / year_income * 100) if year_income > 0 else 0
    
    # Calculate monthly budget remaining
    monthly_budget_remaining = 0
    if current_budget:
        monthly_budget_remaining = current_budget.total_expenses - month_expenses
    
    return FinanceSummary(
        today=FinanceStats(
            total_income=today_income,
            total_expenses=today_expenses,
            net_balance=today_balance,
            savings_rate=today_savings_rate,
            monthly_budget_remaining=monthly_budget_remaining,
            top_categories=top_categories[:3],
            recent_transactions=recent_transactions[:5]
        ),
        this_month=FinanceStats(
            total_income=month_income,
            total_expenses=month_expenses,
            net_balance=month_balance,
            savings_rate=month_savings_rate,
            monthly_budget_remaining=monthly_budget_remaining,
            top_categories=top_categories,
            recent_transactions=recent_transactions
        ),
        this_year=FinanceStats(
            total_income=year_income,
            total_expenses=year_expenses,
            net_balance=year_balance,
            savings_rate=year_savings_rate,
            monthly_budget_remaining=monthly_budget_remaining,
            top_categories=top_categories,
            recent_transactions=recent_transactions
        ),
        categories=categories,
        current_budget=current_budget
    )


@router.get("/budget", response_model=List[FinanceBudgetResponse])
async def get_finance_budgets(
    year: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's finance budgets
    
    Args:
        year: Filter by year
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[FinanceBudgetResponse]: List of finance budgets
    """
    query = db.query(FinanceBudget).filter(FinanceBudget.user_id == current_user.id)
    
    if year:
        query = query.filter(FinanceBudget.budget_year == year)
    
    budgets = query.order_by(desc(FinanceBudget.budget_year), desc(FinanceBudget.budget_month)).all()
    
    return budgets


@router.post("/budget", response_model=FinanceBudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_finance_budget(
    budget_data: FinanceBudgetCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new finance budget
    
    Args:
        budget_data: Finance budget data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        FinanceBudgetResponse: Created finance budget
    """
    # Check if budget already exists for this month/year
    existing_budget = db.query(FinanceBudget).filter(
        FinanceBudget.user_id == current_user.id,
        FinanceBudget.budget_year == budget_data.budget_year,
        FinanceBudget.budget_month == budget_data.budget_month
    ).first()
    
    if existing_budget:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budget already exists for this month and year"
        )
    
    new_budget = FinanceBudget(
        user_id=current_user.id,
        **budget_data.dict()
    )
    
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    
    log_user_action("create", current_user.id, "finance_budget", new_budget.id)
    
    return new_budget
