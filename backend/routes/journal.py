"""
Journal routes for Ayubi aka System
"""
from datetime import date, datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from database import get_db
from models.user import User
from models.journal import JournalEntry, JournalTemplate
from schemas.journal_schema import (
    JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse,
    JournalTemplateCreate, JournalTemplateUpdate, JournalTemplateResponse,
    JournalEntrySearch, JournalStats, JournalDashboard
)
from utils.auth import get_current_active_user
from utils.helpers import get_today, generate_tags_from_text
from utils.logger import log_user_action

router = APIRouter(prefix="/journal", tags=["Journal"])


@router.get("/entries", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    is_favorite: Optional[bool] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's journal entries with filters
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        category: Filter by category
        is_favorite: Filter by favorite status
        start_date: Filter entries from this date
        end_date: Filter entries to this date
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[JournalEntryResponse]: List of journal entries
    """
    query = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id)
    
    if category:
        query = query.filter(JournalEntry.category == category)
    
    if is_favorite is not None:
        query = query.filter(JournalEntry.is_favorite == is_favorite)
    
    if start_date:
        query = query.filter(JournalEntry.created_at >= datetime.combine(start_date, datetime.min.time()))
    
    if end_date:
        query = query.filter(JournalEntry.created_at <= datetime.combine(end_date, datetime.max.time()))
    
    entries = query.order_by(desc(JournalEntry.created_at)).offset(skip).limit(limit).all()
    
    log_user_action("read", current_user.id, "journal_entries", None)
    
    return entries


@router.post("/entries", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    entry_data: JournalEntryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new journal entry
    
    Args:
        entry_data: Journal entry data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalEntryResponse: Created journal entry
    """
    # Auto-generate tags if not provided
    auto_tags = generate_tags_from_text(entry_data.content)
    final_tags = entry_data.tags or ",".join(auto_tags)
    
    new_entry = JournalEntry(
        user_id=current_user.id,
        tags=final_tags,
        **entry_data.dict(exclude={"tags"})
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    log_user_action("create", current_user.id, "journal_entry", new_entry.id, {"title": entry_data.title})
    
    return new_entry


@router.get("/entries/{entry_id}", response_model=JournalEntryResponse)
async def get_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific journal entry
    
    Args:
        entry_id: Journal entry ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalEntryResponse: Journal entry
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    log_user_action("read", current_user.id, "journal_entry", entry_id)
    
    return entry


@router.put("/entries/{entry_id}", response_model=JournalEntryResponse)
async def update_journal_entry(
    entry_id: int,
    entry_update: JournalEntryUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a journal entry
    
    Args:
        entry_id: Journal entry ID
        entry_update: Journal entry update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalEntryResponse: Updated journal entry
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    # Auto-generate tags if content is updated and no tags provided
    if entry_update.content and not entry_update.tags:
        auto_tags = generate_tags_from_text(entry_update.content)
        entry_update.tags = ",".join(auto_tags)
    
    # Update entry fields
    update_data = entry_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    db.commit()
    db.refresh(entry)
    
    log_user_action("update", current_user.id, "journal_entry", entry_id, {"fields": list(update_data.keys())})
    
    return entry


@router.delete("/entries/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a journal entry
    
    Args:
        entry_id: Journal entry ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If entry not found or not owned by user
    """
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    db.delete(entry)
    db.commit()
    
    log_user_action("delete", current_user.id, "journal_entry", entry_id)


@router.post("/search", response_model=List[JournalEntryResponse])
async def search_journal_entries(
    search_data: JournalEntrySearch,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Search journal entries
    
    Args:
        search_data: Search parameters
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[JournalEntryResponse]: Search results
    """
    query = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id)
    
    # Text search
    if search_data.query:
        search_term = f"%{search_data.query}%"
        query = query.filter(
            or_(
                JournalEntry.title.ilike(search_term),
                JournalEntry.content.ilike(search_term)
            )
        )
    
    # Tag search
    if search_data.tags:
        for tag in search_data.tags:
            query = query.filter(JournalEntry.tags.ilike(f"%{tag}%"))
    
    # Category filter
    if search_data.category:
        query = query.filter(JournalEntry.category == search_data.category)
    
    # Mood filter
    if search_data.mood:
        query = query.filter(JournalEntry.mood == search_data.mood)
    
    # Date range filter
    if search_data.date_from:
        query = query.filter(JournalEntry.created_at >= datetime.fromisoformat(search_data.date_from))
    
    if search_data.date_to:
        query = query.filter(JournalEntry.created_at <= datetime.fromisoformat(search_data.date_to))
    
    # Favorite filter
    if search_data.is_favorite is not None:
        query = query.filter(JournalEntry.is_favorite == search_data.is_favorite)
    
    entries = query.order_by(desc(JournalEntry.created_at)).offset(
        search_data.offset
    ).limit(search_data.limit).all()
    
    log_user_action("search", current_user.id, "journal_entries", None, {"query": search_data.query})
    
    return entries


@router.get("/stats", response_model=JournalStats)
async def get_journal_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get journal statistics
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalStats: Journal statistics
    """
    # Total entries
    total_entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).count()
    
    # This month entries
    current_month = get_today().replace(day=1)
    entries_this_month = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.created_at >= datetime.combine(current_month, datetime.min.time())
    ).count()
    
    # This year entries
    current_year = get_today().replace(month=1, day=1)
    entries_this_year = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.created_at >= datetime.combine(current_year, datetime.min.time())
    ).count()
    
    # Favorite entries
    favorite_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.is_favorite == True
    ).count()
    
    # Most used tags
    tag_stats = db.query(
        func.trim(func.unnest(func.string_to_array(JournalEntry.tags, ','))).label('tag'),
        func.count().label('count')
    ).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.tags.isnot(None),
        JournalEntry.tags != ''
    ).group_by('tag').order_by(desc('count')).limit(10).all()
    
    most_used_tags = [
        {"tag": stat.tag, "count": stat.count}
        for stat in tag_stats
    ]
    
    # Mood distribution
    mood_stats = db.query(
        JournalEntry.mood,
        func.count().label('count')
    ).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.mood.isnot(None)
    ).group_by(JournalEntry.mood).all()
    
    mood_distribution = [
        {"mood": stat.mood, "count": stat.count}
        for stat in mood_stats
    ]
    
    # Writing streak (consecutive days with entries)
    # This is a simplified calculation
    writing_streak = 0  # Could implement more sophisticated streak calculation
    
    # Average entry length
    avg_length_result = db.query(
        func.avg(func.length(JournalEntry.content))
    ).filter(JournalEntry.user_id == current_user.id).scalar()
    
    average_entry_length = float(avg_length_result) if avg_length_result else 0
    
    return JournalStats(
        total_entries=total_entries,
        entries_this_month=entries_this_month,
        entries_this_year=entries_this_year,
        favorite_entries=favorite_entries,
        most_used_tags=most_used_tags,
        mood_distribution=mood_distribution,
        writing_streak=writing_streak,
        average_entry_length=round(average_entry_length, 1)
    )


@router.get("/dashboard", response_model=JournalDashboard)
async def get_journal_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get journal dashboard data
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalDashboard: Complete journal dashboard data
    """
    # Get stats
    stats = await get_journal_stats(current_user, db)
    
    # Get recent entries
    recent_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).order_by(desc(JournalEntry.created_at)).limit(5).all()
    
    # Get templates
    templates = db.query(JournalTemplate).filter(
        JournalTemplate.user_id == current_user.id,
        JournalTemplate.is_active == True
    ).all()
    
    # Get popular tags
    popular_tags = []
    if stats.most_used_tags:
        popular_tags = [tag["tag"] for tag in stats.most_used_tags[:10]]
    
    return JournalDashboard(
        stats=stats,
        recent_entries=recent_entries,
        templates=templates,
        popular_tags=popular_tags
    )


@router.get("/templates", response_model=List[JournalTemplateResponse])
async def get_journal_templates(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's journal templates
    
    Args:
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        List[JournalTemplateResponse]: List of journal templates
    """
    templates = db.query(JournalTemplate).filter(
        JournalTemplate.user_id == current_user.id,
        JournalTemplate.is_active == True
    ).all()
    
    return templates


@router.post("/templates", response_model=JournalTemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_template(
    template_data: JournalTemplateCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new journal template
    
    Args:
        template_data: Journal template data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalTemplateResponse: Created journal template
    """
    new_template = JournalTemplate(
        user_id=current_user.id,
        **template_data.dict()
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    log_user_action("create", current_user.id, "journal_template", new_template.id, {"name": template_data.name})
    
    return new_template


@router.put("/templates/{template_id}", response_model=JournalTemplateResponse)
async def update_journal_template(
    template_id: int,
    template_update: JournalTemplateUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a journal template
    
    Args:
        template_id: Journal template ID
        template_update: Journal template update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        JournalTemplateResponse: Updated journal template
        
    Raises:
        HTTPException: If template not found or not owned by user
    """
    template = db.query(JournalTemplate).filter(
        JournalTemplate.id == template_id,
        JournalTemplate.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal template not found"
        )
    
    # Update template fields
    update_data = template_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(template, field, value)
    
    db.commit()
    db.refresh(template)
    
    log_user_action("update", current_user.id, "journal_template", template_id, {"fields": list(update_data.keys())})
    
    return template


@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_template(
    template_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a journal template
    
    Args:
        template_id: Journal template ID
        current_user: Current authenticated user
        db: Database session
        
    Raises:
        HTTPException: If template not found or not owned by user
    """
    template = db.query(JournalTemplate).filter(
        JournalTemplate.id == template_id,
        JournalTemplate.user_id == current_user.id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal template not found"
        )
    
    db.delete(template)
    db.commit()
    
    log_user_action("delete", current_user.id, "journal_template", template_id)
