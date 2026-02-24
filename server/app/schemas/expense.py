import uuid
from datetime import date as date_type
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.expense import ExpenseCategory


class ExpenseCreate(BaseModel):
    amount: float = Field(gt=0)
    category: ExpenseCategory
    description: str | None = None
    date: date_type


class ExpenseUpdate(BaseModel):
    amount: float | None = Field(None, gt=0)
    category: ExpenseCategory | None = None
    description: str | None = None
    date: Optional[date_type] = None


class ExpenseResponse(BaseModel):
    id: uuid.UUID
    amount: float
    category: ExpenseCategory
    description: str | None
    date: date_type
    created_at: datetime

    model_config = {"from_attributes": True}


class ExpenseListResponse(BaseModel):
    items: list[ExpenseResponse]
    total: int
    page: int
    page_size: int


class CategorySummary(BaseModel):
    category: ExpenseCategory
    total: float
    percentage: float


class MonthlySummary(BaseModel):
    month: int
    year: int
    total_spent: float
    by_category: list[CategorySummary]
