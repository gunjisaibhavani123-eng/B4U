from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import FixedExpense, User
from app.schemas.user import DependentUpdate, FixedExpensesUpdate, IncomeUpdate, UserUpdate


def update_profile(db: Session, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def set_income(db: Session, user: User, data: IncomeUpdate) -> User:
    user.monthly_salary = data.monthly_salary
    user.other_income = data.other_income
    db.commit()
    db.refresh(user)
    return user


def set_fixed_expenses(db: Session, user: User, data: FixedExpensesUpdate) -> User:
    # Replace all fixed expenses
    db.query(FixedExpense).filter(FixedExpense.user_id == user.id).delete()
    for exp in data.expenses:
        db.add(FixedExpense(user_id=user.id, category=exp.category, amount=exp.amount))
    db.commit()
    db.refresh(user)
    return user


def set_dependents(db: Session, user: User, data: DependentUpdate) -> User:
    user.dependent_type = data.dependent_type
    db.commit()
    db.refresh(user)
    return user


def complete_onboarding(db: Session, user: User) -> User:
    if not user.monthly_salary:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Income must be set before completing onboarding")
    user.onboarding_complete = True
    db.commit()
    db.refresh(user)
    return user
