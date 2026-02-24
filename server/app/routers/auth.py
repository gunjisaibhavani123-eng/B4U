from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest, TokenResponse
from app.services.auth_service import authenticate_user, create_tokens, logout_user, refresh_access_token, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, body.phone, body.name, body.password)
    return create_tokens(db, user)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, body.phone, body.password)
    return create_tokens(db, user)


@router.post("/refresh", response_model=TokenResponse)
def refresh(body: RefreshRequest, db: Session = Depends(get_db)):
    return refresh_access_token(db, body.refresh_token)


@router.post("/logout")
def logout(body: LogoutRequest, db: Session = Depends(get_db)):
    logout_user(db, body.refresh_token)
    return {"message": "Logged out successfully"}
