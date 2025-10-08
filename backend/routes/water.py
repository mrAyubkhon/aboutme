"""
Water tracking routes for Ayubi aka System
"""
from datetime import date, datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database import get_db
from models.user import User
from models.water import WaterEntry, WaterGoal
from schemas.water_schema import (
    WaterEntryCreate, WaterEntryUpdate, WaterEntryResponse,
    WaterGoalCreate, WaterGoalUpdate, WaterGoalResponse,
    WaterStats, WaterHistory, WaterDashboard
)
from utils.auth import get_current_active_user
from utils.helpers import get_today, format_water_amount, get_water_recommendation
from utils.logger import log_user_action

router = APIRouter(prefix="/water", tags=["Water Tracking"])


@router.get("/", response_model=List[WaterEntryResponse])
async def get_water_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    entry_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's water entries
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        entry_date: Filter by specific date
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[WaterEntryResponse]: List of water entries
    """
    query = db.query(WaterEntry).filter(WaterEntry.user_id == current_user.id)
    
    if entry_date:
        query = query.filter(WaterEntry.entry_date == entry_date)
    
    entries = query.order_by(desc(WaterEntry.entry_time)).offset(skip).limit(limit).all()
    
    log_user_action("read", current_user.id, "water_entries", None)
    
    return entries


@router.post("/", response_model=WaterEntryResponse, status_code=status.HTTP_201_CREATED)
async def add_water_entry(
    entry_data: WaterEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add a new water entry
    
    Args:
        entry_data: Water entry data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        WaterEntryResponse: Created water entry
    """
    # Use today's date if not specified
    entry_date = entry_data.entry_date or get_today()
    
    new_entry = WaterEntry(
        user_id=current_user.id,
        entry_date=entry_date,
        **entry_data.dict(exclude={"entry_date"})
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    log_user_action("create", current_user.id, "water_entry", new_entry.id, {"amount": entry_data.amount})
    
    return new_entry


@router.get("/today", response_model=WaterStats)
async def get_today_water_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get today's water intake statistics
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        WaterStats: Today's water statistics
    """
    today = get_today()
    
    # Get today's entries
    today_entries = db.query(WaterEntry).filter(
        WaterEntry.user_id == current_user.id,
        WaterEntry.entry_date == today
    ).all()
    
    # Get user's water goal
    water_goal = db.query(WaterGoal).filter(WaterGoal.user_id == current_user.id).first()
    daily_goal = water_goal.daily_goal if water_goal else current_user.daily_water_goal
    
    # Calculate statistics
    today_total = sum(entry.amount for entry in today_entries)
    entries_count = len(today_entries)
    average_per_entry = today_total / entries_count if entries_count > 0 else 0
    progress_percentage = (today_total / daily_goal) * 100 if daily_goal > 0 else 0
    remaining_to_goal = max(0, daily_goal - today_total)
    
    # Calculate streak (consecutive days meeting goal)
    streak_days = 0
    check_date = today
    while True:
        day_entries = db.query(WaterEntry).filter(
            WaterEntry.user_id == current_user.id,
            WaterEntry.entry_date == check_date
        ).all()
        
        day_total = sum(entry.amount for entry in day_entries)
        if day_total >= daily_goal:
            streak_days += 1
            check_date -= timedelta(days=1)
        else:
            break
    
    # Calculate weekly average
    week_ago = today - timedelta(days=7)
    weekly_entries = db.query(WaterEntry).filter(
        WaterEntry.user_id == current_user.id,
        WaterEntry.entry_date >= week_ago,
        WaterEntry.entry_date <= today
    ).all()
    
    weekly_total = sum(entry.amount for entry in weekly_entries)
    weekly_average = weekly_total / 7
    
    return WaterStats(
        today_total=today_total,
        daily_goal=daily_goal,
        progress_percentage=round(progress_percentage, 1),
        entries_today=entries_count,
        average_per_entry=round(average_per_entry, 1),
        remaining_to_goal=remaining_to_goal,
        streak_days=streak_days,
        weekly_average=round(weekly_average, 1)
    )


@router.get("/history", response_model=List[WaterHistory])
async def get_water_history(
    days: int = Query(7, ge=1, le=30),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get water intake history
    
    Args:
        days: Number of days to retrieve
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[WaterHistory]: Water intake history
    """
    end_date = get_today()
    start_date = end_date - timedelta(days=days-1)
    
    # Get entries in date range
    entries = db.query(WaterEntry).filter(
        WaterEntry.user_id == current_user.id,
        WaterEntry.entry_date >= start_date,
        WaterEntry.entry_date <= end_date
    ).all()
    
    # Get user's water goal
    water_goal = db.query(WaterGoal).filter(WaterGoal.user_id == current_user.id).first()
    daily_goal = water_goal.daily_goal if water_goal else current_user.daily_water_goal
    
    # Group entries by date
    entries_by_date = {}
    for entry in entries:
        if entry.entry_date not in entries_by_date:
            entries_by_date[entry.entry_date] = []
        entries_by_date[entry.entry_date].append(entry)
    
    # Create history records
    history = []
    current_date = start_date
    
    while current_date <= end_date:
        day_entries = entries_by_date.get(current_date, [])
        total_amount = sum(entry.amount for entry in day_entries)
        
        history.append(WaterHistory(
            date=current_date,
            total_amount=total_amount,
            entries_count=len(day_entries),
            goal_met=total_amount >= daily_goal
        ))
        
        current_date += timedelta(days=1)
    
    return history


@router.get("/dashboard", response_model=WaterDashboard)
async def get_water_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get water tracking dashboard data
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        WaterDashboard: Complete water dashboard data
    """
    # Get stats
    stats = await get_today_water_stats(current_user, db)
    
    # Get or create water goal
    water_goal = db.query(WaterGoal).filter(WaterGoal.user_id == current_user.id).first()
    if not water_goal:
        # Create default water goal
        water_goal = WaterGoal(
            user_id=current_user.id,
            daily_goal=current_user.daily_water_goal
        )
        db.add(water_goal)
        db.commit()
        db.refresh(water_goal)
    
    # Get recent entries
    recent_entries = db.query(WaterEntry).filter(
        WaterEntry.user_id == current_user.id
    ).order_by(desc(WaterEntry.entry_time)).limit(10).all()
    
    # Get weekly history
    weekly_history = await get_water_history(7, current_user, db)
    
    return WaterDashboard(
        stats=stats,
        goal=water_goal,
        recent_entries=recent_entries,
        weekly_history=weekly_history
    )


@router.get("/goal", response_model=WaterGoalResponse)
async def get_water_goal(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's water goal settings
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        WaterGoalResponse: Water goal settings
    """
    water_goal = db.query(WaterGoal).filter(WaterGoal.user_id == current_user.id).first()
    
    if not water_goal:
        # Create default water goal
        water_goal = WaterGoal(
            user_id=current_user.id,
            daily_goal=current_user.daily_water_goal
        )
        db.add(water_goal)
        db.commit()
        db.refresh(water_goal)
    
    return water_goal


@router.put("/goal", response_model=WaterGoalResponse)
async def update_water_goal(
    goal_update: WaterGoalUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user's water goal settings
    
    Args:
        goal_update: Water goal update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        WaterGoalResponse: Updated water goal settings
    """
    water_goal = db.query(WaterGoal).filter(WaterGoal.user_id == current_user.id).first()
    
    if not water_goal:
        # Create new water goal
        water_goal = WaterGoal(user_id=current_user.id)
        db.add(water_goal)
    
    # Update goal fields
    update_data = goal_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(water_goal, field, value)
    
    db.commit()
    db.refresh(water_goal)
    
    log_user_action("update", current_user.id, "water_goal", water_goal.id, {"fields": list(update_data.keys())})
    
    return water_goal


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_water_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a water entry
    
    Args:
        entry_id: Water entry ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(WaterEntry).filter(
        WaterEntry.id == entry_id,
        WaterEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Water entry not found"
        )
    
    db.delete(entry)
    db.commit()
    
    log_user_action("delete", current_user.id, "water_entry", entry_id)


@router.get("/recommendation")
async def get_water_recommendation_endpoint(
    weather: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get water intake recommendation
    
    Args:
        weather: Current weather condition
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        dict: Water intake recommendation
    """
    # Get today's stats
    stats = await get_today_water_stats(current_user, db)
    
    # Get recommendation
    recommendation = get_water_recommendation(
        stats.today_total,
        stats.daily_goal,
        weather
    )
    
    return recommendation
