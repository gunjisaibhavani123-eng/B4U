import uuid
from datetime import date

from sqlalchemy.orm import Session

from app.models.expense import ExpenseCategory
from app.models.goal import Goal
from app.schemas.nudge import AdjustmentOption, BudgetImpact, GoalImpact, NudgeCheckResponse
from app.services.budget_service import get_category_allocation, get_current_budget
from app.services.expense_service import get_category_spend, get_month_total
from app.utils.calculations import days_remaining_in_month

CATEGORY_LABELS = {
    ExpenseCategory.FOOD_DINING: "Food & Dining",
    ExpenseCategory.GROCERIES: "Groceries",
    ExpenseCategory.TRANSPORT: "Transport",
    ExpenseCategory.SHOPPING: "Shopping",
    ExpenseCategory.ENTERTAINMENT: "Entertainment",
    ExpenseCategory.BILLS: "Bills",
    ExpenseCategory.HEALTH: "Health",
    ExpenseCategory.EDUCATION_EXP: "Education",
    ExpenseCategory.PERSONAL_CARE: "Personal Care",
    ExpenseCategory.GIFTS_DONATIONS: "Gifts & Donations",
    ExpenseCategory.OTHER: "Other",
}


def evaluate_spend(
    db: Session,
    user_id: uuid.UUID,
    amount: float,
    category: ExpenseCategory,
) -> NudgeCheckResponse:
    today = date.today()
    month, year = today.month, today.year

    # 1. Category budget and current spend
    allocation = get_category_allocation(db, user_id, category, month, year)
    current_spend = get_category_spend(db, user_id, category, month, year)

    remaining_before = allocation - current_spend
    remaining_after = remaining_before - amount

    # 2. Percent used after this purchase
    percent_used_after = int((current_spend + amount) / allocation * 100) if allocation > 0 else 100

    budget_impact = BudgetImpact(
        category_name=CATEGORY_LABELS.get(category, category.value),
        remaining_before=remaining_before,
        remaining_after=remaining_after,
        percent_used_after=min(percent_used_after, 999),
    )

    # 3. Goal impact
    goals = db.query(Goal).filter(Goal.user_id == user_id, Goal.is_active == True).all()
    goal_impacts = []
    for g in goals:
        # Simple heuristic: if over budget, it could affect goal savings
        goal_impacts.append(GoalImpact(goal_name=g.name, affected=remaining_after < 0))

    # 4. Determine status
    days_left = days_remaining_in_month()

    if allocation <= 0:
        # No budget set for this category
        nudge_status = "OK"
        message = "No budget set for this category. Consider creating a budget to track your spending."
    elif remaining_after >= 0 and percent_used_after <= 75:
        nudge_status = "OK"
        message = f"This fits within your {CATEGORY_LABELS.get(category, category.value)} budget. You'll have {_fmt(remaining_after)} left."
    elif remaining_after >= 0 and percent_used_after > 75:
        nudge_status = "WARNING"
        message = f"You'll use {percent_used_after}% of your {CATEGORY_LABELS.get(category, category.value)} budget with {days_left} days left this month."
    else:
        nudge_status = "EXCEEDS"
        message = f"This would exceed your {CATEGORY_LABELS.get(category, category.value)} budget by {_fmt(abs(remaining_after))}."

    # 5. Adjustment options (if exceeds, find spare budget in other categories)
    adjustment_options = []
    if nudge_status == "EXCEEDS":
        budget = get_current_budget(db, user_id, month, year)
        if budget:
            for bc in budget.categories:
                if bc.category != category:
                    cat_spent = get_category_spend(db, user_id, bc.category, month, year)
                    available = float(bc.allocated_amount) - cat_spent
                    if available > 0:
                        adjustment_options.append(AdjustmentOption(
                            category=CATEGORY_LABELS.get(bc.category, bc.category.value),
                            available=available,
                        ))

    return NudgeCheckResponse(
        status=nudge_status,
        message=message,
        budget_impact=budget_impact,
        goal_impact=goal_impacts,
        days_remaining_in_month=days_left,
        adjustment_options=adjustment_options,
    )


def _fmt(amount: float) -> str:
    return f"\u20b9{int(round(amount)):,}"
