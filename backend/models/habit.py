"""
Habit model for Ayubi aka System
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Habit(Base):
    """Habit model for tracking daily habits"""
    
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Habit details
    title = Column(String(200), nullable=False)
    description = Column(Text)
    icon = Column(String(10), default="🎯")
    color = Column(String(20), default="blue")
    category = Column(String(50), default="personal")
    
    # Habit settings
    frequency = Column(String(20), default="daily")  # daily, weekly, monthly
    difficulty = Column(String(20), default="easy")  # easy, medium, hard
    target_count = Column(Integer, default=1)  # how many times per day
    
    # Progress tracking
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_completions = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_paused = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="habits")
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Habit(id={self.id}, title='{self.title}', user_id={self.user_id})>"


class HabitCompletion(Base):
    """Habit completion tracking"""
    
    __tablename__ = "habit_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Completion details
    completion_date = Column(Date, nullable=False)
    completion_time = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    
    # Relationships
    habit = relationship("Habit", back_populates="completions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<HabitCompletion(id={self.id}, habit_id={self.habit_id}, date={self.completion_date})>"
