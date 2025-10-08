"""
Simple FastAPI application for Ayubi aka System Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI application
app = FastAPI(
    title="Ayubi aka System API",
    version="1.0.0",
    description="Backend API for Ayubi aka System - Personal Dashboard"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Welcome to Ayubi aka System API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/api/v1/journal")
async def get_journal_entries():
    """
    Get journal entries (mock data for now)
    """
    return {
        "entries": [
            {
                "id": 1,
                "title": "Test Entry",
                "content": "This is a test journal entry",
                "created_at": "2024-01-01T00:00:00Z"
            }
        ]
    }

@app.post("/api/v1/journal")
async def create_journal_entry(entry_data: dict):
    """
    Create a new journal entry
    """
    return {
        "message": "Journal entry created successfully",
        "entry_id": 1,
        "data": entry_data
    }

@app.get("/api/v1/game-stats/steam/{steam_id}")
async def get_steam_stats(steam_id: str):
    """
    Get Steam statistics for a user
    """
    return {
        "steam_id": steam_id,
        "message": "Steam stats endpoint - integration needed",
        "status": "placeholder"
    }

@app.get("/api/v1/game-stats/faceit/{nickname}")
async def get_faceit_stats(nickname: str):
    """
    Get Faceit statistics for a user
    """
    return {
        "nickname": nickname,
        "message": "Faceit stats endpoint - integration needed",
        "status": "placeholder"
    }

@app.get("/api/v1/game-stats/health")
async def game_stats_health():
    """
    Health check for game stats service
    """
    return {
        "status": "healthy",
        "services": {
            "steam": "available",
            "faceit": "available"
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

