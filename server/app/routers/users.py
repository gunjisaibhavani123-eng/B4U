from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.user import DependentUpdate, FixedExpensesUpdate, IncomeUpdate, UserResponse, UserUpdate
from app.services.user_service import complete_onboarding, set_dependents, set_fixed_expenses, set_income, update_profile

router = APIRouter(prefix="/users", tags=["users"])


def _user_response(user: User) -> dict:
    data = {c.key: getattr(user, c.key) for c in user.__table__.columns}
    data["fixed_expenses"] = [{"category": fe.category, "amount": float(fe.amount)} for fe in user.fixed_expenses]
    return data


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    return _user_response(user)


@router.patch("/me", response_model=UserResponse)
def patch_me(body: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = update_profile(db, user, body)
    return _user_response(user)


@router.put("/me/income", response_model=UserResponse)
def put_income(body: IncomeUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = set_income(db, user, body)
    return _user_response(user)


@router.put("/me/fixed-expenses", response_model=UserResponse)
def put_fixed_expenses(body: FixedExpensesUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = set_fixed_expenses(db, user, body)
    return _user_response(user)


@router.put("/me/dependents", response_model=UserResponse)
def put_dependents(body: DependentUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = set_dependents(db, user, body)
    return _user_response(user)


@router.post("/me/complete-onboarding", response_model=UserResponse)
def post_complete_onboarding(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user = complete_onboarding(db, user)
    return _user_response(user)
