import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.checklist import ChecklistItemType, ChecklistStatus


class ChecklistItemUpdate(BaseModel):
    status: ChecklistStatus
    details: dict | None = None


class ChecklistItemResponse(BaseModel):
    id: uuid.UUID
    item_type: ChecklistItemType
    status: ChecklistStatus
    details: dict | None
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ChecklistScoreResponse(BaseModel):
    completed: int
    total: int
    score_label: str
    items: list[ChecklistItemResponse]
