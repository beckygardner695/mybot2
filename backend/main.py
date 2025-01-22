from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
import uvicorn

from database import engine, SessionLocal
from config import get_settings
from middleware.error_middleware import ErrorHandlingMiddleware
from middleware.rate_limit import RateLimitMiddleware
from utils.logger import app_logger
from tasks.task_manager import TaskManager
import models
import routers

settings = get_settings()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Task manager instance
task_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global task_manager
    task_manager = TaskManager(SessionLocal())
    await task_manager.start_all_tasks()
    app_logger.info("Application started, background tasks initialized")
    
    yield
    
    # Shutdown
    if task_manager:
        await task_manager.stop_all_tasks()
    app_logger.info("Application shutting down, tasks stopped")

app = FastAPI(
    title=settings.APP_NAME,
    description="Reddit Bot API",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include routers
app.include_router(
    routers.accounts.router,
    prefix=f"{settings.API_V1_PREFIX}/accounts",
    tags=["accounts"]
)
app.include_router(
    routers.posts.router,
    prefix=f"{settings.API_V1_PREFIX}/posts",
    tags=["posts"]
)
app.include_router(
    routers.analytics.router,
    prefix=f"{settings.API_V1_PREFIX}/analytics",
    tags=["analytics"]
)
app.include_router(
    routers.scheduling.router,
    prefix=f"{settings.API_V1_PREFIX}/scheduling",
    tags=["scheduling"]
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )