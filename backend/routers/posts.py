from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services.post_service import PostService

router = APIRouter()

@router.post("/", response_model=schemas.Post)
async def create_post(post: schemas.PostCreate, db: Session = Depends(get_db)):
    service = PostService(db)
    return await service.create_post(post)

@router.post("/bulk", response_model=List[schemas.Post])
async def create_bulk_posts(posts: List[schemas.PostCreate], db: Session = Depends(get_db)):
    service = PostService(db)
    return await service.create_bulk_posts(posts)

@router.post("/upload-media")
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    service = PostService(db)
    return await service.upload_media(file)

@router.get("/", response_model=List[schemas.Post])
async def get_posts(
    skip: int = 0,
    limit: int = 100,
    account_id: int = None,
    subreddit: str = None,
    db: Session = Depends(get_db)
):
    service = PostService(db)
    return await service.get_posts(skip, limit, account_id, subreddit)

@router.get("/{post_id}", response_model=schemas.Post)
async def get_post(post_id: int, db: Session = Depends(get_db)):
    service = PostService(db)
    post = await service.get_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.put("/{post_id}", response_model=schemas.Post)
async def update_post(
    post_id: int,
    post_update: schemas.PostUpdate,
    db: Session = Depends(get_db)
):
    service = PostService(db)
    return await service.update_post(post_id, post_update)

@router.delete("/{post_id}")
async def delete_post(post_id: int, db: Session = Depends(get_db)):
    service = PostService(db)
    await service.delete_post(post_id)
    return {"message": "Post deleted successfully"}