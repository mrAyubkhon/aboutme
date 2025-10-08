"""
Main FastAPI application for Ayubi aka System Backend
"""
from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
from typing import Dict, Any

from config import settings
from database import create_tables, get_db
from routes import auth, habits, water, finance, journal
from utils.logger import setup_logger, log_request, log_error
from models.user import User
from models.habit import Habit, HabitCompletion
from models.water import WaterEntry, WaterGoal
from models.finance import FinanceEntry, FinanceCategory, FinanceBudget
from models.journal import JournalEntry, JournalTemplate
from routes.auth import get_current_active_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events
    """
    # Startup
    setup_logger(
        log_level="INFO",
        log_file="logs/ayubi_system.log"
    )
    
    # Create database tables
    create_tables()
    
    yield
    
    # Shutdown
    # Cleanup code here if needed


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend API for Ayubi aka System - Personal Dashboard",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all HTTP requests
    """
    start_time = time.time()
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Get user ID from request if available
        user_id = None
        if hasattr(request.state, "user_id"):
            user_id = request.state.user_id
        
        log_request(
            method=request.method,
            url=str(request.url),
            status_code=response.status_code,
            response_time=process_time,
            user_id=user_id
        )
        
        return response
    
    except Exception as e:
        process_time = time.time() - start_time
        
        log_error(
            error=e,
            context=f"HTTP {request.method} {request.url}",
            response_time=process_time
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"}
        )


# Include routers
app.include_router(
    auth.router,
    prefix=settings.api_v1_prefix,
    tags=["Authentication"]
)

app.include_router(
    habits.router,
    prefix=settings.api_v1_prefix,
    tags=["Habits"]
)

app.include_router(
    water.router,
    prefix=settings.api_v1_prefix,
    tags=["Water Tracking"]
)

app.include_router(
    finance.router,
    prefix=settings.api_v1_prefix,
    tags=["Finance"]
)

app.include_router(
    journal.router,
    prefix=settings.api_v1_prefix,
    tags=["Journal"]
)


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Welcome to Ayubi aka System API",
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": settings.app_version
    }


@app.get("/export/{user_id}")
async def export_user_data(
    user_id: int,
    current_user = Depends(get_current_active_user)
):
    """
    Export all user data as JSON
    
    Args:
        user_id: User ID to export
        current_user: Current authenticated user
        
    Returns:
        dict: Complete user data export
        
    Raises:
        HTTPException: If user not found or not authorized
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to export this user's data"
        )
    
    # Get all user data
    db = next(get_db())
    
    try:
        # Export habits
        habits = db.query(Habit).filter(Habit.user_id == user_id).all()
        habit_completions = db.query(HabitCompletion).join(Habit).filter(
            Habit.user_id == user_id
        ).all()
        
        # Export water entries
        water_entries = db.query(WaterEntry).filter(WaterEntry.user_id == user_id).all()
        water_goals = db.query(WaterGoal).filter(WaterGoal.user_id == user_id).all()
        
        # Export finance entries
        finance_entries = db.query(FinanceEntry).filter(FinanceEntry.user_id == user_id).all()
        finance_categories = db.query(FinanceCategory).filter(FinanceCategory.user_id == user_id).all()
        finance_budgets = db.query(FinanceBudget).filter(FinanceBudget.user_id == user_id).all()
        
        # Export journal entries
        journal_entries = db.query(JournalEntry).filter(JournalEntry.user_id == user_id).all()
        journal_templates = db.query(JournalTemplate).filter(JournalTemplate.user_id == user_id).all()
        
        export_data = {
            "user": {
                "id": current_user.id,
                "username": current_user.username,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "created_at": current_user.created_at.isoformat(),
                "settings": {
                    "timezone": current_user.timezone,
                    "theme": current_user.theme,
                    "language": current_user.language,
                    "daily_water_goal": current_user.daily_water_goal,
                    "daily_habits_reminder": current_user.daily_habits_reminder,
                    "finance_budget_limit": current_user.finance_budget_limit
                }
            },
            "habits": [
                {
                    "id": habit.id,
                    "title": habit.title,
                    "description": habit.description,
                    "icon": habit.icon,
                    "color": habit.color,
                    "category": habit.category,
                    "frequency": habit.frequency,
                    "difficulty": habit.difficulty,
                    "target_count": habit.target_count,
                    "current_streak": habit.current_streak,
                    "longest_streak": habit.longest_streak,
                    "total_completions": habit.total_completions,
                    "is_active": habit.is_active,
                    "created_at": habit.created_at.isoformat()
                }
                for habit in habits
            ],
            "habit_completions": [
                {
                    "id": completion.id,
                    "habit_id": completion.habit_id,
                    "completion_date": completion.completion_date.isoformat(),
                    "completion_time": completion.completion_time.isoformat(),
                    "notes": completion.notes
                }
                for completion in habit_completions
            ],
            "water_entries": [
                {
                    "id": entry.id,
                    "amount": entry.amount,
                    "entry_date": entry.entry_date.isoformat(),
                    "entry_time": entry.entry_time.isoformat(),
                    "drink_type": entry.drink_type,
                    "temperature": entry.temperature,
                    "notes": entry.notes
                }
                for entry in water_entries
            ],
            "water_goals": [
                {
                    "id": goal.id,
                    "daily_goal": goal.daily_goal,
                    "glass_size": goal.glass_size,
                    "reminder_enabled": goal.reminder_enabled,
                    "reminder_interval": goal.reminder_interval,
                    "reminder_start_time": goal.reminder_start_time,
                    "reminder_end_time": goal.reminder_end_time,
                    "created_at": goal.created_at.isoformat()
                }
                for goal in water_goals
            ],
            "finance_entries": [
                {
                    "id": entry.id,
                    "amount": float(entry.amount),
                    "transaction_type": entry.transaction_type,
                    "category": entry.category,
                    "description": entry.description,
                    "notes": entry.notes,
                    "payment_method": entry.payment_method,
                    "location": entry.location,
                    "tags": entry.tags,
                    "entry_date": entry.entry_date.isoformat(),
                    "entry_time": entry.entry_time.isoformat(),
                    "is_recurring": entry.is_recurring,
                    "recurring_frequency": entry.recurring_frequency
                }
                for entry in finance_entries
            ],
            "finance_categories": [
                {
                    "id": category.id,
                    "name": category.name,
                    "category_type": category.category_type,
                    "color": category.color,
                    "icon": category.icon,
                    "monthly_budget": float(category.monthly_budget) if category.monthly_budget else None,
                    "budget_warning_percentage": category.budget_warning_percentage,
                    "created_at": category.created_at.isoformat()
                }
                for category in finance_categories
            ],
            "journal_entries": [
                {
                    "id": entry.id,
                    "title": entry.title,
                    "content": entry.content,
                    "mood": entry.mood,
                    "weather": entry.weather,
                    "location": entry.location,
                    "tags": entry.tags,
                    "category": entry.category,
                    "is_private": entry.is_private,
                    "is_favorite": entry.is_favorite,
                    "created_at": entry.created_at.isoformat(),
                    "updated_at": entry.updated_at.isoformat() if entry.updated_at else None
                }
                for entry in journal_entries
            ],
            "journal_templates": [
                {
                    "id": template.id,
                    "name": template.name,
                    "description": template.description,
                    "template_content": template.template_content,
                    "is_default": template.is_default,
                    "created_at": template.created_at.isoformat()
                }
                for template in journal_templates
            ],
            "export_info": {
                "exported_at": time.time(),
                "export_version": "1.0",
                "total_records": {
                    "habits": len(habits),
                    "habit_completions": len(habit_completions),
                    "water_entries": len(water_entries),
                    "finance_entries": len(finance_entries),
                    "journal_entries": len(journal_entries)
                }
            }
        }
        
        return export_data
    
    finally:
        db.close()


@app.post("/import")
async def import_user_data(
    import_data: Dict[str, Any],
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Import user data from JSON
    
    Args:
        import_data: User data to import
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        dict: Import summary
    """
    # This is a simplified import - in production you'd want more validation
    try:
        imported_count = 0
        
        # Import habits
        if "habits" in import_data:
            for habit_data in import_data["habits"]:
                habit = Habit(
                    user_id=current_user.id,
                    title=habit_data["title"],
                    description=habit_data.get("description"),
                    icon=habit_data.get("icon", "🎯"),
                    color=habit_data.get("color", "blue"),
                    category=habit_data.get("category", "personal"),
                    frequency=habit_data.get("frequency", "daily"),
                    difficulty=habit_data.get("difficulty", "easy"),
                    target_count=habit_data.get("target_count", 1),
                    current_streak=habit_data.get("current_streak", 0),
                    longest_streak=habit_data.get("longest_streak", 0),
                    total_completions=habit_data.get("total_completions", 0),
                    is_active=habit_data.get("is_active", True)
                )
                db.add(habit)
                imported_count += 1
        
        db.commit()
        
        return {
            "message": "Data imported successfully",
            "imported_records": imported_count,
            "user_id": current_user.id
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Import failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
