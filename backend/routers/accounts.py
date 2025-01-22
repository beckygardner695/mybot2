from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services.account_service import AccountService

router = APIRouter()

@router.post("/", response_model=schemas.Account)
async def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    service = AccountService(db)
    return await service.create_account(account)

@router.get("/", response_model=List[schemas.Account])
async def get_accounts(db: Session = Depends(get_db)):
    service = AccountService(db)
    return await service.get_accounts()

@router.get("/{account_id}", response_model=schemas.Account)
async def get_account(account_id: int, db: Session = Depends(get_db)):
    service = AccountService(db)
    account = await service.get_account(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.put("/{account_id}", response_model=schemas.Account)
async def update_account(
    account_id: int, 
    account_update: schemas.AccountUpdate, 
    db: Session = Depends(get_db)
):
    service = AccountService(db)
    return await service.update_account(account_id, account_update)

@router.delete("/{account_id}")
async def delete_account(account_id: int, db: Session = Depends(get_db)):
    service = AccountService(db)
    await service.delete_account(account_id)
    return {"message": "Account deleted successfully"}