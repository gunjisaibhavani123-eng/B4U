from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.checklist import ChecklistItemType, ChecklistStatus, UserChecklistItem
from app.models.user import RefreshToken, User
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


def register_user(db: Session, phone: str, name: str, password: str) -> User:
    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone number already registered")

    user = User(phone=phone, name=name, password_hash=hash_password(password))
    db.add(user)
    db.flush()

    # Seed default checklist items
    for item_type in ChecklistItemType:
        db.add(UserChecklistItem(user_id=user.id, item_type=item_type, status=ChecklistStatus.MISSING))

    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, phone: str, password: str) -> User:
    user = db.query(User).filter(User.phone == phone).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid phone or password")
    return user


def create_tokens(db: Session, user: User) -> dict:
    access_token = create_access_token(user.id)
    refresh_token, expires_at = create_refresh_token(user.id)

    db_token = RefreshToken(token=refresh_token, user_id=user.id, expires_at=expires_at)
    db.add(db_token)
    db.commit()

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    db_token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if not db_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if db_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        db.delete(db_token)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Rotate refresh token
    db.delete(db_token)
    return create_tokens(db, user)


def logout_user(db: Session, refresh_token: str) -> None:
    db_token = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
    if db_token:
        db.delete(db_token)
        db.commit()
