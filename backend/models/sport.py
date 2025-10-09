"""
Sport/Fitness models for Ayubi aka System
Tracks water, food, workouts and fitness goals
"""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class SportWater(Base):
    """Water intake tracking"""
    __tablename__ = "sport_water"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    ml = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="sport_water_entries")


class SportFood(Base):
    """Food/meal tracking"""
    __tablename__ = "sport_food"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    kcal = Column(Integer, nullable=False)
    protein = Column(Float, nullable=True)
    carbs = Column(Float, nullable=True)
    fat = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="sport_food_entries")


class SportWorkout(Base):
    """Workout/exercise tracking"""
    __tablename__ = "sport_workout"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    duration_min = Column(Integer, nullable=False)
    kcal_burned = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="sport_workout_entries")


class SportGoals(Base):
    """User fitness goals"""
    __tablename__ = "sport_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    water_ml_per_day = Column(Integer, default=3000)
    kcal_per_day = Column(Integer, default=2200)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="sport_goals")

