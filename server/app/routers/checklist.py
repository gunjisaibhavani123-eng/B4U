from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.checklist import ChecklistItemType
from app.models.user import User
from app.schemas.checklist import ChecklistItemResponse, ChecklistItemUpdate, ChecklistScoreResponse
from app.services import checklist_service

router = APIRouter(prefix="/checklist", tags=["checklist"])


@router.get("", response_model=ChecklistScoreResponse)
def get_checklist(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.get_score(db, user.id)


@router.get("/{item_type}", response_model=ChecklistItemResponse)
def get_checklist_item(
    item_type: ChecklistItemType,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.get_item(db, user.id, item_type)


@router.patch("/{item_type}", response_model=ChecklistItemResponse)
def update_checklist_item(
    item_type: ChecklistItemType,
    data: ChecklistItemUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return checklist_service.update_item(db, user.id, item_type, data)
