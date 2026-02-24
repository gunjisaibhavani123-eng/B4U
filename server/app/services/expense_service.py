import uuid
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app.models.expense import Expense, ExpenseCategory
from app.schemas.expense import CategorySummary, ExpenseCreate, ExpenseUpdate


def create_expense(db: Session, user_id: uuid.UUID, data: ExpenseCreate) -> Expense:
    expense = Expense(user_id=user_id, **data.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def list_expenses(
    db: Session,
    user_id: uuid.UUID,
    month: int | None = None,
    year: int | None = None,
    category: ExpenseCategory | None = None,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Expense], int]:
    query = db.query(Expense).filter(Expense.user_id == user_id)

    if month and year:
        query = query.filter(
            extract("month", Expense.date) == month,
            extract("year", Expense.date) == year,
        )
    if category:
        query = query.filter(Expense.category == category)

    total = query.count()
    items = query.order_by(Expense.date.desc(), Expense.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def get_expense(db: Session, user_id: uuid.UUID, expense_id: uuid.UUID) -> Expense:
    expense = db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


def update_expense(db: Session, user_id: uuid.UUID, expense_id: uuid.UUID, data: ExpenseUpdate) -> Expense:
    expense = get_expense(db, user_id, expense_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, user_id: uuid.UUID, expense_id: uuid.UUID) -> None:
    expense = get_expense(db, user_id, expense_id)
    db.delete(expense)
    db.commit()


def get_monthly_summary(db: Session, user_id: uuid.UUID, month: int, year: int) -> dict:
    rows = (
        db.query(Expense.category, func.sum(Expense.amount).label("total"))
        .filter(
            Expense.user_id == user_id,
            extract("month", Expense.date) == month,
            extract("year", Expense.date) == year,
        )
        .group_by(Expense.category)
        .all()
    )

    total_spent = sum(float(r.total) for r in rows)
    by_category = [
        CategorySummary(
            category=r.category,
            total=float(r.total),
            percentage=round(float(r.total) / total_spent * 100, 1) if total_spent > 0 else 0,
        )
        for r in rows
    ]

    return {"month": month, "year": year, "total_spent": total_spent, "by_category": by_category}


def get_month_total(db: Session, user_id: uuid.UUID, month: int, year: int) -> float:
    result = (
        db.query(func.sum(Expense.amount))
        .filter(
            Expense.user_id == user_id,
            extract("month", Expense.date) == month,
            extract("year", Expense.date) == year,
        )
        .scalar()
    )
    return float(result) if result else 0.0


def get_category_spend(db: Session, user_id: uuid.UUID, category: ExpenseCategory, month: int, year: int) -> float:
    result = (
        db.query(func.sum(Expense.amount))
        .filter(
            Expense.user_id == user_id,
            Expense.category == category,
            extract("month", Expense.date) == month,
            extract("year", Expense.date) == year,
        )
        .scalar()
    )
    return float(result) if result else 0.0
