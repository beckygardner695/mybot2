from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
import time
from utils.logger import app_logger

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            start_time = time.time()
            response = await call_next(request)
            process_time = time.time() - start_time
            
            # Log request completion
            app_logger.info(
                f"Request completed: {request.method} {request.url.path} "
                f"(Duration: {process_time:.2f}s, Status: {response.status_code})"
            )
            
            return response
            
        except Exception as exc:
            app_logger.exception("Unhandled exception occurred")
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "detail": str(exc)
                }
            )

# /app/backend/middleware/rate_limit.py
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
from config import get_settings

settings = get_settings()

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.request_counts = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old requests
        self.request_counts[client_ip] = [
            req_time for req_time in self.request_counts[client_ip]
            if current_time - req_time < settings.RATE_LIMIT_PERIOD
        ]
        
        # Check rate limit
        if len(self.request_counts[client_ip]) >= settings.RATE_LIMIT_REQUESTS:
            raise HTTPException(
                status_code=429,
                detail="Too many requests"
            )
        
        # Add current request
        self.request_counts[client_ip].append(current_time)
        
        return await call_next(request)