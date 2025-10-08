"""
Water tracking model for Ayubi aka System
"""
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class WaterEntry(Base):
    """Water intake tracking entries"""
    
    __tablename__ = "water_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Water details
    amount = Column(Integer, nullable=False)  # amount in ml
    entry_date = Column(Date, nullable=False)
    entry_time = Column(DateTime(timezone=True), server_default=func.now())
    
    # Optional details
    drink_type = Column(String(50), default="water")  # water, tea, coffee, juice, etc.
    temperature = Column(String(20), default="room")  # cold, room, warm, hot
    notes = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="water_entries")
    
    def __repr__(self):
        return f"<WaterEntry(id={self.id}, amount={self.amount}ml, user_id={self.user_id})>"


class WaterGoal(Base):
    """Water goals and settings"""
    
    __tablename__ = "water_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Goal settings
    daily_goal = Column(Integer, default=2500)  # daily goal in ml
    glass_size = Column(Integer, default=250)  # standard glass size in ml
    
    # Reminder settings
    reminder_enabled = Column(String(20), default="true")  # true, false
    reminder_interval = Column(Integer, default=120)  # minutes between reminders
    reminder_start_time = Column(String(10), default="08:00")  # HH:MM format
    reminder_end_time = Column(String(10), default="22:00")  # HH:MM format
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<WaterGoal(id={self.id}, daily_goal={self.daily_goal}ml, user_id={self.user_id})>"
