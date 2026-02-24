import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.budget import Budget, BudgetCategory
from app.schemas.budget import BudgetCategoriesUpdate, BudgetCreate
from app.services.expense_service import get_category_spend


def create_budget(db: Session, user_id: uuid.UUID, data: BudgetCreate) -> Budget:
    existing = (
        db.query(Budget)
        .filter(Budget.user_id == user_id, Budget.month == data.month, Budget.year == data.year)
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Budget already exists for this month")

    budget = Budget(user_id=user_id, month=data.month, year=data.year, total_income=data.total_income)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def get_current_budget(db: Session, user_id: uuid.UUID, month: int, year: int) -> Budget | None:
    return (
        db.query(Budget)
        .filter(Budget.user_id == user_id, Budget.month == month, Budget.year == year)
        .first()
    )


def set_budget_categories(db: Session, user_id: uuid.UUID, budget_id: uuid.UUID, data: BudgetCategoriesUpdate) -> Budget:
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")

    db.query(BudgetCategory).filter(BudgetCategory.budget_id == budget.id).delete()
    for cat in data.categories:
        db.add(BudgetCategory(
            budget_id=budget.id,
            user_id=user_id,
            category=cat.category,
            allocated_amount=cat.allocated_amount,
        ))
    db.commit()
    db.refresh(budget)
    return budget


def enrich_budget(db: Session, budget: Budget) -> dict:
    categories = []
    for bc in budget.categories:
        spent = get_category_spend(db, budget.user_id, bc.category, budget.month, budget.year)
        categories.append({
            "category": bc.category,
            "allocated_amount": float(bc.allocated_amount),
            "spent_amount": spent,
            "remaining": float(bc.allocated_amount) - spent,
        })
    return {
        "id": budget.id,
        "month": budget.month,
        "year": budget.year,
        "total_income": float(budget.total_income),
        "categories": categories,
    }


def get_category_allocation(db: Session, user_id: uuid.UUID, category: str, month: int, year: int) -> float:
    budget = get_current_budget(db, user_id, month, year)
    if not budget:
        return 0.0
    bc = db.query(BudgetCategory).filter(
        BudgetCategory.budget_id == budget.id,
        BudgetCategory.category == category,
    ).first()
    return float(bc.allocated_amount) if bc else 0.0
