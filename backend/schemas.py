from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
from datetime import datetime

# Account Schemas
class AccountBase(BaseModel):
    username: str
    client_id: str
    client_secret: str
    is_default: bool = False
    auto_refresh: bool = True

class AccountCreate(AccountBase):
    pass

class AccountUpdate(BaseModel):
    username: Optional[str] = None
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    is_default: Optional[bool] = None
    auto_refresh: Optional[bool] = None

class Account(AccountBase):
    id: int
    is_active: bool
    created_at: datetime
    last_used: Optional[datetime]

    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    title: str
    content: Optional[str] = None
    subreddit: str
    is_nsfw: bool = False
    is_spoiler: bool = False
    flair: Optional[str] = None
    media_url: Optional[HttpUrl] = None
    metadata: Optional[Dict] = None

class PostCreate(PostBase):
    account_id: int
    scheduled_time: Optional[datetime] = None

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subreddit: Optional[str] = None
    is_nsfw: Optional[bool] = None
    is_spoiler: Optional[bool] = None
    flair: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    metadata: Optional[Dict] = None

class Post(PostBase):
    id: int
    account_id: int
    created_at: datetime
    post_id: Optional[str] = None
    is_posted: bool
    scheduled_time: Optional[datetime]

    class Config:
        from_attributes = True

# Analytics Schemas
class AnalyticsBase(BaseModel):
    post_id: str
    subreddit: str
    score: int
    upvote_ratio: float
    num_comments: int
    created_at: datetime

class AnalyticsCreate(AnalyticsBase):
    pass

class Analytics(AnalyticsBase):
    id: int
    tracked_at: datetime
    metadata: Optional[Dict] = None

    class Config:
        from_attributes = True

class AnalyticsOverview(BaseModel):
    total_posts: int
    total_karma: int
    avg_score: float
    avg_comments: float
    engagement_rate: float
    best_performing_posts: List[Post]
    performance_by_subreddit: Dict
    growth_trends: Dict

class SubredditAnalytics(BaseModel):
    subscriber_count: int
    active_users: int
    post_frequency: Dict
    engagement_metrics: Dict
    best_posting_times: List[Dict]
    content_analysis: Dict

class TrendAnalysis(BaseModel):
    keyword_trends: List[Dict]
    topic_trends: List[Dict]
    engagement_patterns: Dict
    predictions: Dict

# Autoresponder Schemas
class AutoresponderBase(BaseModel):
    name: str
    type: str  # 'comment' or 'message'
    template: str
    conditions: Dict
    is_active: bool = True

class AutoresponderCreate(AutoresponderBase):
    account_id: int

class AutoresponderUpdate(BaseModel):
    name: Optional[str] = None
    template: Optional[str] = None
    conditions: Optional[Dict] = None
    is_active: Optional[bool] = None

class Autoresponder(AutoresponderBase):
    id: int
    account_id: int
    created_at: datetime
    last_triggered: Optional[datetime]

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TokenData(BaseModel):
    username: str
    account_id: int

class UserAuth(BaseModel):
    username: str
    password: str