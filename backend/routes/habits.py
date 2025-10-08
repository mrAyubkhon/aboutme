"""
Habits routes for Ayubi aka System
"""
from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from database import get_db
from models.user import User
from models.habit import Habit, HabitCompletion
from schemas.habit_schema import (
    HabitCreate, HabitUpdate, HabitResponse, HabitStats,
    HabitCompletionCreate, HabitCompletionResponse,
    HabitWithCompletions
)
from utils.auth import get_current_active_user
from utils.helpers import get_today, calculate_streak, calculate_completion_rate
from utils.logger import log_user_action

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get("/", response_model=List[HabitResponse])
async def get_habits(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(True),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's habits
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        active_only: Return only active habits
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[HabitResponse]: List of user's habits
    """
    query = db.query(Habit).filter(Habit.user_id == current_user.id)
    
    if active_only:
        query = query.filter(Habit.is_active == True)
    
    habits = query.offset(skip).limit(limit).all()
    
    log_user_action("read", current_user.id, "habits", None)
    
    return habits


@router.post("/", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
async def create_habit(
    habit_data: HabitCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new habit
    
    Args:
        habit_data: Habit creation data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        HabitResponse: Created habit
    """
    new_habit = Habit(
        user_id=current_user.id,
        **habit_data.dict()
    )
    
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    
    log_user_action("create", current_user.id, "habit", new_habit.id, {"title": habit_data.title})
    
    return new_habit


@router.get("/{habit_id}", response_model=HabitWithCompletions)
async def get_habit(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific habit with its completions
    
    Args:
        habit_id: Habit ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        HabitWithCompletions: Habit with completion history
        
    Raises:
        HTTPException: If habit not found or not owned by user
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Get recent completions (last 30 days)
    thirty_days_ago = get_today() - date.resolution * 30
    completions = db.query(HabitCompletion).filter(
        HabitCompletion.habit_id == habit_id,
        HabitCompletion.completion_date >= thirty_days_ago
    ).order_by(desc(HabitCompletion.completion_date)).all()
    
    log_user_action("read", current_user.id, "habit", habit_id)
    
    return HabitWithCompletions(
        **habit.__dict__,
        completions=completions
    )


@router.put("/{habit_id}", response_model=HabitResponse)
async def update_habit(
    habit_id: int,
    habit_update: HabitUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a habit
    
    Args:
        habit_id: Habit ID
        habit_update: Habit update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        HabitResponse: Updated habit
        
    Raises:
        HTTPException: If habit not found or not owned by user
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Update habit fields
    update_data = habit_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(habit, field, value)
    
    db.commit()
    db.refresh(habit)
    
    log_user_action("update", current_user.id, "habit", habit_id, {"fields": list(update_data.keys())})
    
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(
    habit_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a habit
    
    Args:
        habit_id: Habit ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If habit not found or not owned by user
    """
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    db.delete(habit)
    db.commit()
    
    log_user_action("delete", current_user.id, "habit", habit_id)


@router.post("/{habit_id}/complete", response_model=HabitCompletionResponse, status_code=status.HTTP_201_CREATED)
async def complete_habit(
    habit_id: int,
    completion_data: HabitCompletionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Mark a habit as completed for a specific date
    
    Args:
        habit_id: Habit ID
        completion_data: Completion data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        HabitCompletionResponse: Created completion record
        
    Raises:
        HTTPException: If habit not found or already completed
    """
    # Check if habit exists and belongs to user
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Check if already completed for this date
    existing_completion = db.query(HabitCompletion).filter(
        HabitCompletion.habit_id == habit_id,
        HabitCompletion.completion_date == completion_data.completion_date
    ).first()
    
    if existing_completion:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Habit already completed for this date"
        )
    
    # Create completion record
    new_completion = HabitCompletion(
        habit_id=habit_id,
        user_id=current_user.id,
        completion_date=completion_data.completion_date,
        notes=completion_data.notes
    )
    
    db.add(new_completion)
    
    # Update habit statistics
    habit.total_completions += 1
    
    # Calculate streak
    completion_dates = [
        comp.completion_date for comp in db.query(HabitCompletion).filter(
            HabitCompletion.habit_id == habit_id
        ).all()
    ]
    
    habit.current_streak = calculate_streak(completion_dates)
    habit.longest_streak = max(habit.longest_streak, habit.current_streak)
    
    db.commit()
    db.refresh(new_completion)
    
    log_user_action("complete", current_user.id, "habit", habit_id, {"date": str(completion_data.completion_date)})
    
    return new_completion


@router.delete("/{habit_id}/complete/{completion_date}", status_code=status.HTTP_204_NO_CONTENT)
async def uncomplete_habit(
    habit_id: int,
    completion_date: date,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Remove a habit completion for a specific date
    
    Args:
        habit_id: Habit ID
        completion_date: Completion date to remove
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If habit or completion not found
    """
    # Check if habit exists and belongs to user
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Habit not found"
        )
    
    # Find and delete completion
    completion = db.query(HabitCompletion).filter(
        HabitCompletion.habit_id == habit_id,
        HabitCompletion.completion_date == completion_date
    ).first()
    
    if not completion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Completion not found"
        )
    
    db.delete(completion)
    
    # Update habit statistics
    habit.total_completions = max(0, habit.total_completions - 1)
    
    # Recalculate streak
    completion_dates = [
        comp.completion_date for comp in db.query(HabitCompletion).filter(
            HabitCompletion.habit_id == habit_id
        ).all()
    ]
    
    habit.current_streak = calculate_streak(completion_dates)
    
    db.commit()
    
    log_user_action("uncomplete", current_user.id, "habit", habit_id, {"date": str(completion_date)})


@router.get("/stats/overview", response_model=HabitStats)
async def get_habits_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get habits statistics overview
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        HabitStats: Habits statistics
    """
    today = get_today()
    
    # Get all user habits
    all_habits = db.query(Habit).filter(Habit.user_id == current_user.id).all()
    active_habits = [h for h in all_habits if h.is_active]
    
    # Get today's completions
    today_completions = db.query(HabitCompletion).join(Habit).filter(
        Habit.user_id == current_user.id,
        HabitCompletion.completion_date == today
    ).count()
    
    # Calculate statistics
    total_habits = len(all_habits)
    active_habits_count = len(active_habits)
    completed_today = today_completions
    total_completions = sum(h.total_completions for h in all_habits)
    
    # Calculate average streak
    average_streak = sum(h.current_streak for h in all_habits) / len(all_habits) if all_habits else 0
    longest_streak = max((h.longest_streak for h in all_habits), default=0)
    
    # Calculate completion rate
    completion_rate = calculate_completion_rate(completed_today, active_habits_count)
    
    return HabitStats(
        total_habits=total_habits,
        active_habits=active_habits_count,
        completed_today=completed_today,
        total_completions=total_completions,
        average_streak=round(average_streak, 1),
        longest_streak=longest_streak,
        completion_rate=completion_rate
    )
