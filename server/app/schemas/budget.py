import uuid

from pydantic import BaseModel, Field

from app.models.expense import ExpenseCategory


class BudgetCategorySchema(BaseModel):
    category: ExpenseCategory
    allocated_amount: float = Field(ge=0)


class BudgetCreate(BaseModel):
    month: int = Field(ge=1, le=12)
    year: int = Field(ge=2020)
    total_income: float = Field(gt=0)


class BudgetCategoriesUpdate(BaseModel):
    categories: list[BudgetCategorySchema]


class BudgetCategoryResponse(BaseModel):
    category: ExpenseCategory
    allocated_amount: float
    spent_amount: float = 0
    remaining: float = 0

    model_config = {"from_attributes": True}


class BudgetResponse(BaseModel):
    id: uuid.UUID
    month: int
    year: int
    total_income: float
    categories: list[BudgetCategoryResponse] = []

    model_config = {"from_attributes": True}
