import uuid
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.checklist import ChecklistItemType, ChecklistStatus, UserChecklistItem
from app.schemas.checklist import ChecklistItemUpdate


def get_all_items(db: Session, user_id: uuid.UUID) -> list[UserChecklistItem]:
    return db.query(UserChecklistItem).filter(UserChecklistItem.user_id == user_id).all()


def get_item(db: Session, user_id: uuid.UUID, item_type: ChecklistItemType) -> UserChecklistItem:
    item = (
        db.query(UserChecklistItem)
        .filter(UserChecklistItem.user_id == user_id, UserChecklistItem.item_type == item_type)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist item not found")
    return item


def update_item(db: Session, user_id: uuid.UUID, item_type: ChecklistItemType, data: ChecklistItemUpdate) -> UserChecklistItem:
    item = get_item(db, user_id, item_type)
    item.status = data.status
    item.details = data.details
    if data.status == ChecklistStatus.COMPLETE and not item.completed_at:
        item.completed_at = datetime.now(timezone.utc)
    elif data.status != ChecklistStatus.COMPLETE:
        item.completed_at = None
    db.commit()
    db.refresh(item)
    return item


def get_score(db: Session, user_id: uuid.UUID) -> dict:
    items = get_all_items(db, user_id)
    completed = sum(1 for i in items if i.status == ChecklistStatus.COMPLETE)
    total = len(items)
    return {
        "completed": completed,
        "total": total,
        "score_label": f"{completed}/{total}",
        "items": items,
    }
