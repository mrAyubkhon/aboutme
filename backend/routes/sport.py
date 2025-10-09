"""
Sport/Fitness API routes for Ayubi aka System
Handles water, food, workouts and fitness goals
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date, datetime, timedelta

from database import get_db
from models.user import User
from models.sport import SportWater, SportFood, SportWorkout, SportGoals
from schemas.sport_schema import (
    SportWaterCreate, SportWaterResponse,
    SportFoodCreate, SportFoodResponse,
    SportWorkoutCreate, SportWorkoutResponse,
    SportGoalsUpdate, SportGoalsResponse,
    SportDailyStats, SportWeeklyStats, SportOverviewResponse
)
from routes.auth import get_current_active_user

router = APIRouter(prefix="/sport", tags=["sport"])


# Water Endpoints
@router.post("/water", response_model=SportWaterResponse, status_code=status.HTTP_201_CREATED)
async def add_water(
    water_data: SportWaterCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add water intake entry"""
    water_entry = SportWater(
        user_id=current_user.id,
        **water_data.dict()
    )
    db.add(water_entry)
    db.commit()
    db.refresh(water_entry)
    return water_entry


@router.get("/water", response_model=List[SportWaterResponse])
async def get_water_entries(
    start_date: date = None,
    end_date: date = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get water entries within date range"""
    query = db.query(SportWater).filter(SportWater.user_id == current_user.id)
    
    if start_date:
        query = query.filter(SportWater.date >= start_date)
    if end_date:
        query = query.filter(SportWater.date <= end_date)
    
    return query.order_by(SportWater.date.desc()).all()


@router.delete("/water/{water_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_water(
    water_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete water entry"""
    water = db.query(SportWater).filter(
        SportWater.id == water_id,
        SportWater.user_id == current_user.id
    ).first()
    
    if not water:
        raise HTTPException(status_code=404, detail="Water entry not found")
    
    db.delete(water)
    db.commit()
    return None


# Food Endpoints
@router.post("/food", response_model=SportFoodResponse, status_code=status.HTTP_201_CREATED)
async def add_food(
    food_data: SportFoodCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add food/meal entry"""
    food_entry = SportFood(
        user_id=current_user.id,
        **food_data.dict()
    )
    db.add(food_entry)
    db.commit()
    db.refresh(food_entry)
    return food_entry


@router.get("/food", response_model=List[SportFoodResponse])
async def get_food_entries(
    start_date: date = None,
    end_date: date = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get food entries within date range"""
    query = db.query(SportFood).filter(SportFood.user_id == current_user.id)
    
    if start_date:
        query = query.filter(SportFood.date >= start_date)
    if end_date:
        query = query.filter(SportFood.date <= end_date)
    
    return query.order_by(SportFood.date.desc(), SportFood.created_at.desc()).all()


@router.delete("/food/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food(
    food_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete food entry"""
    food = db.query(SportFood).filter(
        SportFood.id == food_id,
        SportFood.user_id == current_user.id
    ).first()
    
    if not food:
        raise HTTPException(status_code=404, detail="Food entry not found")
    
    db.delete(food)
    db.commit()
    return None


# Workout Endpoints
@router.post("/workout", response_model=SportWorkoutResponse, status_code=status.HTTP_201_CREATED)
async def add_workout(
    workout_data: SportWorkoutCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add workout/exercise entry"""
    workout_entry = SportWorkout(
        user_id=current_user.id,
        **workout_data.dict()
    )
    db.add(workout_entry)
    db.commit()
    db.refresh(workout_entry)
    return workout_entry


@router.get("/workout", response_model=List[SportWorkoutResponse])
async def get_workout_entries(
    start_date: date = None,
    end_date: date = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get workout entries within date range"""
    query = db.query(SportWorkout).filter(SportWorkout.user_id == current_user.id)
    
    if start_date:
        query = query.filter(SportWorkout.date >= start_date)
    if end_date:
        query = query.filter(SportWorkout.date <= end_date)
    
    return query.order_by(SportWorkout.date.desc(), SportWorkout.created_at.desc()).all()


@router.delete("/workout/{workout_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workout(
    workout_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete workout entry"""
    workout = db.query(SportWorkout).filter(
        SportWorkout.id == workout_id,
        SportWorkout.user_id == current_user.id
    ).first()
    
    if not workout:
        raise HTTPException(status_code=404, detail="Workout entry not found")
    
    db.delete(workout)
    db.commit()
    return None


# Goals Endpoints
@router.get("/goals", response_model=SportGoalsResponse)
async def get_goals(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user fitness goals"""
    goals = db.query(SportGoals).filter(SportGoals.user_id == current_user.id).first()
    
    if not goals:
        # Create default goals
        goals = SportGoals(user_id=current_user.id)
        db.add(goals)
        db.commit()
        db.refresh(goals)
    
    return goals


@router.put("/goals", response_model=SportGoalsResponse)
async def update_goals(
    goals_data: SportGoalsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user fitness goals"""
    goals = db.query(SportGoals).filter(SportGoals.user_id == current_user.id).first()
    
    if not goals:
        goals = SportGoals(user_id=current_user.id, **goals_data.dict())
        db.add(goals)
    else:
        for key, value in goals_data.dict().items():
            setattr(goals, key, value)
        goals.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goals)
    return goals


# Statistics Endpoints
@router.get("/stats/today", response_model=SportDailyStats)
async def get_today_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get today's statistics"""
    today = date.today()
    
    # Water
    water_total = db.query(func.sum(SportWater.ml)).filter(
        SportWater.user_id == current_user.id,
        SportWater.date == today
    ).scalar() or 0
    
    # Food
    food_kcal = db.query(func.sum(SportFood.kcal)).filter(
        SportFood.user_id == current_user.id,
        SportFood.date == today
    ).scalar() or 0
    
    food_count = db.query(func.count(SportFood.id)).filter(
        SportFood.user_id == current_user.id,
        SportFood.date == today
    ).scalar() or 0
    
    # Workouts
    workout_kcal = db.query(func.sum(SportWorkout.kcal_burned)).filter(
        SportWorkout.user_id == current_user.id,
        SportWorkout.date == today
    ).scalar() or 0
    
    workout_count = db.query(func.count(SportWorkout.id)).filter(
        SportWorkout.user_id == current_user.id,
        SportWorkout.date == today
    ).scalar() or 0
    
    return SportDailyStats(
        date=today,
        water_ml=water_total,
        kcal_intake=food_kcal,
        kcal_burned=workout_kcal,
        net_kcal=food_kcal - workout_kcal,
        foods_count=food_count,
        workouts_count=workout_count
    )


@router.get("/stats/week", response_model=SportWeeklyStats)
async def get_week_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get this week's statistics"""
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    
    daily_stats = []
    total_water = 0
    total_intake = 0
    total_burned = 0
    
    for i in range(7):
        current_date = start_of_week + timedelta(days=i)
        
        water = db.query(func.sum(SportWater.ml)).filter(
            SportWater.user_id == current_user.id,
            SportWater.date == current_date
        ).scalar() or 0
        
        kcal_intake = db.query(func.sum(SportFood.kcal)).filter(
            SportFood.user_id == current_user.id,
            SportFood.date == current_date
        ).scalar() or 0
        
        kcal_burned = db.query(func.sum(SportWorkout.kcal_burned)).filter(
            SportWorkout.user_id == current_user.id,
            SportWorkout.date == current_date
        ).scalar() or 0
        
        daily_stats.append(SportDailyStats(
            date=current_date,
            water_ml=water,
            kcal_intake=kcal_intake,
            kcal_burned=kcal_burned,
            net_kcal=kcal_intake - kcal_burned
        ))
        
        total_water += water
        total_intake += kcal_intake
        total_burned += kcal_burned
    
    return SportWeeklyStats(
        start_date=start_of_week,
        end_date=end_of_week,
        total_water_ml=total_water,
        avg_water_ml=total_water // 7,
        total_kcal_intake=total_intake,
        avg_kcal_intake=total_intake // 7,
        total_kcal_burned=total_burned,
        avg_kcal_burned=total_burned // 7,
        daily_stats=daily_stats
    )


@router.get("/overview", response_model=SportOverviewResponse)
async def get_sport_overview(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get complete sport overview (goals, today, week)"""
    goals = await get_goals(current_user, db)
    today = await get_today_stats(current_user, db)
    week = await get_week_stats(current_user, db)
    
    return SportOverviewResponse(
        today=today,
        goals=goals,
        this_week=week
    )

