"""
Authentication routes for Ayubi aka System
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config import settings
from database import get_db
from models.user import User
from schemas.user_schema import UserCreate, UserLogin, UserResponse, Token, UserUpdate
from utils.auth import (
    authenticate_user, 
    create_user_token, 
    get_password_hash,
    get_current_active_user
)
from utils.helpers import validate_password_strength
from utils.logger import log_user_action, log_security_event

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    
    Args:
        user_data: User registration data
        db: Database session
        
    Returns:
        Token: Access token and user data
        
    Raises:
        HTTPException: If user already exists or validation fails
    """
    # Validate password strength
    password_validation = validate_password_strength(user_data.password)
    if not password_validation["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Weak password: {', '.join(password_validation['feedback'])}"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log user registration
    log_user_action("register", new_user.id, "user", new_user.id)
    
    # Create token for new user
    token_data = create_user_token(new_user)
    
    return Token(**token_data)


@router.post("/login", response_model=Token)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login user with username/email and password
    
    Args:
        form_data: OAuth2 form data with username and password
        db: Database session
        
    Returns:
        Token: Access token and user data
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Authenticate user
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        log_security_event("failed_login", None, details={"username": form_data.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    
    # Log successful login
    log_user_action("login", user.id, "user", user.id)
    
    # Create token
    token_data = create_user_token(user)
    
    return Token(**token_data)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user information
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        UserResponse: Current user data
    """
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user information
    
    Args:
        user_update: User update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        UserResponse: Updated user data
    """
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    # Log user update
    log_user_action("update", current_user.id, "user", current_user.id, {"fields": list(update_data.keys())})
    
    return current_user


@router.post("/logout")
async def logout_user(
    current_user: User = Depends(get_current_active_user)
):
    """
    Logout current user (client-side token invalidation)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        dict: Logout confirmation
    """
    # Log logout action
    log_user_action("logout", current_user.id, "user", current_user.id)
    
    return {"message": "Successfully logged out"}


@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(get_current_active_user)
):
    """
    Refresh access token
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Token: New access token and user data
    """
    # Create new token
    token_data = create_user_token(current_user)
    
    return Token(**token_data)
