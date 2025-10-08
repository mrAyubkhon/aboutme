"""
User model for Ayubi aka System
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """User model for authentication and user data"""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(200))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # User preferences
    timezone = Column(String(50), default="UTC")
    theme = Column(String(20), default="dark")  # dark, light, auto
    language = Column(String(10), default="en")
    
    # Settings
    daily_water_goal = Column(Integer, default=2500)  # ml
    daily_habits_reminder = Column(Boolean, default=True)
    finance_budget_limit = Column(Integer, default=None)  # monthly limit
    
    # Relationships
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    water_entries = relationship("WaterEntry", back_populates="user", cascade="all, delete-orphan")
    finance_entries = relationship("FinanceEntry", back_populates="user", cascade="all, delete-orphan")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
