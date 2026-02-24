import uuid
from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.expense import ExpenseCategory
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseListResponse, ExpenseResponse, ExpenseUpdate, MonthlySummary
from app.services.expense_service import (
    create_expense,
    delete_expense,
    get_expense,
    get_monthly_summary,
    list_expenses,
    update_expense,
)

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=ExpenseListResponse)
def get_expenses(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2020),
    category: ExpenseCategory | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = list_expenses(db, user.id, month, year, category, page, page_size)
    return {"items": items, "total": total, "page": page, "page_size": page_size}


@router.post("", response_model=ExpenseResponse, status_code=201)
def post_expense(body: ExpenseCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_expense(db, user.id, body)


@router.get("/summary/monthly", response_model=MonthlySummary)
def get_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2020),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_monthly_summary(db, user.id, month, year)


@router.get("/summary/breakdown", response_model=MonthlySummary)
def get_breakdown(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2020),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_monthly_summary(db, user.id, month, year)


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_single(expense_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_expense(db, user.id, expense_id)


@router.patch("/{expense_id}", response_model=ExpenseResponse)
def patch_expense(expense_id: uuid.UUID, body: ExpenseUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return update_expense(db, user.id, expense_id, body)


@router.delete("/{expense_id}", status_code=204)
def del_expense(expense_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    delete_expense(db, user.id, expense_id)
