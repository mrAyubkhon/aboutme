"""
Finance tracking model for Ayubi aka System
"""
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Float, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class FinanceEntry(Base):
    """Finance entries for income and expenses"""
    
    __tablename__ = "finance_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Entry details
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(20), nullable=False)  # income, expense
    category = Column(String(100), nullable=False)
    description = Column(String(255))
    notes = Column(Text)
    
    # Date and time
    entry_date = Column(Date, nullable=False)
    entry_time = Column(DateTime(timezone=True), server_default=func.now())
    
    # Optional fields
    payment_method = Column(String(50))  # cash, card, bank_transfer, etc.
    location = Column(String(255))
    tags = Column(String(255))  # comma-separated tags
    
    # Recurring transactions
    is_recurring = Column(Boolean, default=False)
    recurring_frequency = Column(String(20))  # daily, weekly, monthly, yearly
    recurring_end_date = Column(Date)
    
    # Relationships
    user = relationship("User", back_populates="finance_entries")
    
    def __repr__(self):
        return f"<FinanceEntry(id={self.id}, amount={self.amount}, type={self.transaction_type}, user_id={self.user_id})>"


class FinanceCategory(Base):
    """Finance categories for better organization"""
    
    __tablename__ = "finance_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Category details
    name = Column(String(100), nullable=False)
    category_type = Column(String(20), nullable=False)  # income, expense
    color = Column(String(20), default="#3b82f6")  # hex color
    icon = Column(String(10), default="💰")
    
    # Settings
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Budget settings
    monthly_budget = Column(Float, default=None)
    budget_warning_percentage = Column(Integer, default=80)  # warn at 80% of budget
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<FinanceCategory(id={self.id}, name='{self.name}', type={self.category_type}, user_id={self.user_id})>"


class FinanceBudget(Base):
    """Monthly budgets and limits"""
    
    __tablename__ = "finance_budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Budget period
    budget_year = Column(Integer, nullable=False)
    budget_month = Column(Integer, nullable=False)  # 1-12
    
    # Budget amounts
    total_income = Column(Float, default=0)
    total_expenses = Column(Float, default=0)
    savings_goal = Column(Float, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<FinanceBudget(id={self.id}, {self.budget_year}-{self.budget_month:02d}, user_id={self.user_id})>"
