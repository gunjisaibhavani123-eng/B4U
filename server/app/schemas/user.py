import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.user import DependentType, FixedExpenseCategory


class FixedExpenseSchema(BaseModel):
    category: FixedExpenseCategory
    amount: float = Field(ge=0)


class UserResponse(BaseModel):
    id: uuid.UUID
    phone: str
    name: str
    age: int | None = None
    city: str | None = None
    monthly_salary: float | None = None
    other_income: float = 0
    dependent_type: DependentType | None = None
    onboarding_complete: bool
    fixed_expenses: list[FixedExpenseSchema] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = None
    age: int | None = Field(None, ge=18, le=100)
    city: str | None = None


class IncomeUpdate(BaseModel):
    monthly_salary: float = Field(gt=0)
    other_income: float = Field(ge=0, default=0)


class FixedExpensesUpdate(BaseModel):
    expenses: list[FixedExpenseSchema]


class DependentUpdate(BaseModel):
    dependent_type: DependentType
