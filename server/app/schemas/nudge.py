from pydantic import BaseModel, Field

from app.models.expense import ExpenseCategory


class NudgeCheckRequest(BaseModel):
    amount: float = Field(gt=0)
    category: ExpenseCategory
    description: str | None = None


class BudgetImpact(BaseModel):
    category_name: str
    remaining_before: float
    remaining_after: float
    percent_used_after: int


class GoalImpact(BaseModel):
    goal_name: str
    affected: bool


class AdjustmentOption(BaseModel):
    category: str
    available: float


class NudgeCheckResponse(BaseModel):
    status: str  # OK, WARNING, EXCEEDS
    message: str
    budget_impact: BudgetImpact | None = None
    goal_impact: list[GoalImpact] = []
    days_remaining_in_month: int
    adjustment_options: list[AdjustmentOption] = []


class NudgeConfirmRequest(BaseModel):
    amount: float = Field(gt=0)
    category: ExpenseCategory
    description: str | None = None
