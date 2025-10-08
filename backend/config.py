"""
Configuration settings for Ayubi aka System Backend
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # App
    app_name: str = "Ayubi aka System API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./ayubi.db"
    database_url_prod: Optional[str] = None
    
    # Security
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()
