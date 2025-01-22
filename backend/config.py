from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application Settings
    APP_NAME: str = "RedditPulse"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./reddit_pulse.db")
    
    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Reddit API Settings
    REDDIT_USER_AGENT: str = "RedditPulse Bot v1.0"
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    
    # Scheduling Settings
    MIN_SCHEDULING_INTERVAL: int = 5  # minutes
    MAX_POSTS_PER_DAY: int = 10
    SCHEDULING_TIMEZONE: str = "UTC"
    
    # Analytics Settings
    ANALYTICS_UPDATE_INTERVAL: int = 5  # minutes
    ANALYTICS_RETENTION_DAYS: int = 90
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # Cache Settings
    CACHE_TTL: int = 300  # seconds
    
    # Logging Settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()