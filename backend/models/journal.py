"""
Journal model for Ayubi aka System
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class JournalEntry(Base):
    """Journal entries for thoughts and reflections"""
    
    __tablename__ = "journal_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Entry content
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    
    # Entry metadata
    mood = Column(String(20))  # happy, sad, anxious, excited, calm, etc.
    weather = Column(String(50))  # sunny, rainy, cloudy, etc.
    location = Column(String(255))
    
    # Tags and categories
    tags = Column(String(500))  # comma-separated tags
    category = Column(String(50), default="general")  # work, personal, health, etc.
    
    # Privacy and sharing
    is_private = Column(Boolean, default=True)
    is_favorite = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="journal_entries")
    
    def __repr__(self):
        return f"<JournalEntry(id={self.id}, title='{self.title}', user_id={self.user_id})>"


class JournalTemplate(Base):
    """Journal templates for structured entries"""
    
    __tablename__ = "journal_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Template details
    name = Column(String(100), nullable=False)
    description = Column(Text)
    template_content = Column(Text, nullable=False)  # JSON structure or markdown
    
    # Template settings
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<JournalTemplate(id={self.id}, name='{self.name}', user_id={self.user_id})>"
