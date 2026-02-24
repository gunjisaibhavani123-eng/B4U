import uuid
from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.budget import BudgetCategoriesUpdate, BudgetCreate, BudgetResponse
from app.services.budget_service import create_budget, enrich_budget, get_current_budget, set_budget_categories

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("/current", response_model=BudgetResponse | None)
def get_current(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    today = date.today()
    budget = get_current_budget(db, user.id, today.month, today.year)
    if not budget:
        return None
    return enrich_budget(db, budget)


@router.post("", response_model=BudgetResponse, status_code=201)
def post_budget(body: BudgetCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    budget = create_budget(db, user.id, body)
    return enrich_budget(db, budget)


@router.put("/{budget_id}/categories", response_model=BudgetResponse)
def put_categories(budget_id: uuid.UUID, body: BudgetCategoriesUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    budget = set_budget_categories(db, user.id, budget_id, body)
    return enrich_budget(db, budget)
