import uuid
from datetime import date as date_type
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.goal import GoalIcon


class GoalCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    icon: GoalIcon
    target_amount: float = Field(gt=0)
    target_date: date_type
    initial_amount: float = Field(ge=0, default=0)


class GoalUpdate(BaseModel):
    name: str | None = None
    icon: GoalIcon | None = None
    target_amount: float | None = Field(None, gt=0)
    target_date: Optional[date_type] = None


class ContributionCreate(BaseModel):
    amount: float = Field(gt=0)
    date: date_type


class ContributionResponse(BaseModel):
    id: uuid.UUID
    amount: float
    date: date_type
    created_at: datetime

    model_config = {"from_attributes": True}


class GoalResponse(BaseModel):
    id: uuid.UUID
    name: str
    icon: GoalIcon
    target_amount: float
    saved_amount: float
    target_date: date_type
    initial_amount: float
    is_active: bool
    progress_percent: int = 0
    monthly_needed: float = 0
    months_remaining: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class GoalDetailResponse(GoalResponse):
    contributions: list[ContributionResponse] = []
