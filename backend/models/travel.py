"""
Travel models for Ayubi aka System
Tracks travel wishlist and visited countries
"""
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class TravelWishlist(Base):
    """Countries user wants to visit"""
    __tablename__ = "travel_wishlist"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    country_iso3 = Column(String(3), nullable=False)
    country_name = Column(String(255), nullable=False)
    continent = Column(String(50), nullable=True)
    added_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="travel_wishlist")
    
    def __repr__(self):
        return f"<TravelWishlist {self.country_name} ({self.country_iso3})>"


class TravelVisited(Base):
    """Countries user has visited"""
    __tablename__ = "travel_visited"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    country_iso3 = Column(String(3), nullable=False)
    country_name = Column(String(255), nullable=False)
    visit_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="travel_visited")
    
    def __repr__(self):
        return f"<TravelVisited {self.country_name} ({self.country_iso3})>"

