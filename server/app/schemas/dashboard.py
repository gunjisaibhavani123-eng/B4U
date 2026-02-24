from pydantic import BaseModel


class GoalPreview(BaseModel):
    name: str
    progress_percent: int
    saved_amount: float
    target_amount: float


class DashboardResponse(BaseModel):
    greeting: str
    month_label: str
    total_income: float
    total_spent: float
    total_saved: float
    remaining: float
    spend_percent: int
    health_score: int
    health_total: int
    active_goal: GoalPreview | None = None
