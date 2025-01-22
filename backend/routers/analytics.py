from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from database import get_db
import schemas
from services.analytics_service import AnalyticsService
from services.trend_analysis_service import TrendAnalysisService

router = APIRouter()

@router.get("/overview", response_model=schemas.AnalyticsOverview)
async def get_analytics_overview(
    account_id: int,
    timeframe: str = "30d",
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return await service.get_overview(account_id, timeframe)

@router.get("/subreddit/{subreddit}", response_model=schemas.SubredditAnalytics)
async def get_subreddit_analytics(
    subreddit: str,
    timeframe: str = "30d",
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return await service.analyze_subreddit(subreddit, timeframe)

@router.get("/trends/{subreddit}", response_model=schemas.TrendAnalysis)
async def get_trend_analysis(
    subreddit: str,
    timeframe: str = "30d",
    db: Session = Depends(get_db)
):
    service = TrendAnalysisService(db)
    return await service.analyze_trends(subreddit, timeframe)

@router.get("/post/{post_id}", response_model=schemas.PostAnalytics)
async def get_post_analytics(post_id: str, db: Session = Depends(get_db)):
    service = AnalyticsService(db)
    return await service.get_post_performance(post_id)

@router.get("/best-times", response_model=Dict)
async def get_best_posting_times(
    subreddit: str,
    db: Session = Depends(get_db)
):
    service = AnalyticsService(db)
    return await service.get_best_posting_times(subreddit)