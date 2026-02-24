from datetime import date, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.goal import Goal
from app.models.user import User
from app.schemas.dashboard import DashboardResponse, GoalPreview
from app.services import checklist_service, expense_service
from app.utils.calculations import goal_progress_percent

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _greeting(name: str) -> str:
    hour = datetime.now().hour
    if hour < 12:
        period = "Morning"
    elif hour < 17:
        period = "Afternoon"
    else:
        period = "Evening"
    return f"Good {period}, {name}!"


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()
    month, year = today.month, today.year

    # Income
    salary = float(user.monthly_salary or 0)
    other = float(user.other_income or 0)
    total_income = salary + other

    # Fixed expenses
    fixed_total = sum(float(fe.amount) for fe in user.fixed_expenses)

    # Variable spending this month
    total_spent = expense_service.get_month_total(db, user.id, month, year)

    total_out = fixed_total + total_spent
    remaining = total_income - total_out
    spend_percent = int(total_out / total_income * 100) if total_income > 0 else 0

    # Health score
    score_data = checklist_service.get_score(db, user.id)

    # Active goal
    active_goal = db.query(Goal).filter(Goal.user_id == user.id, Goal.is_active == True).first()
    goal_preview = None
    if active_goal:
        saved = float(active_goal.saved_amount)
        target = float(active_goal.target_amount)
        goal_preview = GoalPreview(
            name=active_goal.name,
            progress_percent=goal_progress_percent(saved, target),
            saved_amount=saved,
            target_amount=target,
        )

    month_label = today.strftime("%B %Y")

    return DashboardResponse(
        greeting=_greeting(user.name),
        month_label=month_label,
        total_income=total_income,
        total_spent=total_out,
        total_saved=remaining if remaining > 0 else 0,
        remaining=remaining,
        spend_percent=min(spend_percent, 999),
        health_score=score_data["completed"],
        health_total=score_data["total"],
        active_goal=goal_preview,
    )
