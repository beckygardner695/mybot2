from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from praw.exceptions import PRAWException
from sqlalchemy.exc import SQLAlchemyError
from .logger import app_logger

class BotError(Exception):
    """Base exception for bot-related errors"""
    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

class RedditAPIError(BotError):
    """Exception for Reddit API related errors"""
    pass

class SchedulingError(BotError):
    """Exception for scheduling related errors"""
    pass

class DatabaseError(BotError):
    """Exception for database related errors"""
    pass

async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global error handler for all exceptions"""
    
    if isinstance(exc, HTTPException):
        app_logger.warning(f"HTTP Exception: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail}
        )

    if isinstance(exc, PRAWException):
        app_logger.error(f"Reddit API Error: {str(exc)}")
        return JSONResponse(
            status_code=503,
            content={
                "error": "Reddit API Error",
                "detail": str(exc)
            }
        )

    if isinstance(exc, SQLAlchemyError):
        app_logger.error(f"Database Error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Database Error",
                "detail": "An error occurred while accessing the database"
            }
        )

    if isinstance(exc, BotError):
        app_logger.error(f"Bot Error: {exc.message} (Code: {exc.error_code})")
        return JSONResponse(
            status_code=400,
            content={
                "error": exc.message,
                "code": exc.error_code
            }
        )

    # Unexpected errors
    app_logger.exception("Unexpected error occurred")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred"
        }
    )