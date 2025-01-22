from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services.scheduling_service import SchedulingService

router = APIRouter()

@router.post("/schedule", response_model=List[schemas.ScheduledPost])
async def schedule_posts(
    posts: List[schemas.PostCreate],
    db: Session = Depends(get_db)
):
    service = SchedulingService(db)
    return await service.create_schedule(posts)

@router.get("/scheduled", response_model=List[schemas.ScheduledPost])
async def get_scheduled_posts(
    account_id: int,
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db)
):
    service = SchedulingService(db)
    return await service.get_scheduled_posts(account_id, start_date, end_date)

@router.put("/schedule/{post_id}", response_model=schemas.ScheduledPost)
async def update_scheduled_post(
    post_id: int,
    updates: schemas.PostUpdate,
    db: Session = Depends(get_db)
):
    service = SchedulingService(db)
    return await service.update_schedule(post_id, updates)

@router.delete("/schedule/{post_id}")
async def delete_scheduled_post(post_id: int, db: Session = Depends(get_db)):
    service = SchedulingService(db)
    await service.delete_scheduled_post(post_id)
    return {"message": "Scheduled post deleted successfully"}