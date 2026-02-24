import uuid
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.goal import Goal, GoalContribution
from app.schemas.goal import ContributionCreate, GoalCreate, GoalUpdate
from app.utils.calculations import goal_progress_percent, monthly_amount_needed, months_remaining


def create_goal(db: Session, user_id: uuid.UUID, data: GoalCreate) -> Goal:
    # MVP: max 1 active goal
    existing = db.query(Goal).filter(Goal.user_id == user_id, Goal.is_active == True).count()
    if existing >= 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="MVP allows only 1 active goal. Delete existing goal first.")

    goal = Goal(
        user_id=user_id,
        name=data.name,
        icon=data.icon,
        target_amount=data.target_amount,
        target_date=data.target_date,
        initial_amount=data.initial_amount,
        saved_amount=data.initial_amount,
    )
    db.add(goal)

    if data.initial_amount > 0:
        contribution = GoalContribution(
            goal_id=goal.id,
            user_id=user_id,
            amount=data.initial_amount,
            date=date.today(),
        )
        db.add(contribution)

    db.commit()
    db.refresh(goal)
    return goal


def list_goals(db: Session, user_id: uuid.UUID) -> list[Goal]:
    return db.query(Goal).filter(Goal.user_id == user_id).order_by(Goal.created_at.desc()).all()


def get_goal(db: Session, user_id: uuid.UUID, goal_id: uuid.UUID) -> Goal:
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return goal


def update_goal(db: Session, user_id: uuid.UUID, goal_id: uuid.UUID, data: GoalUpdate) -> Goal:
    goal = get_goal(db, user_id, goal_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


def delete_goal(db: Session, user_id: uuid.UUID, goal_id: uuid.UUID) -> None:
    goal = get_goal(db, user_id, goal_id)
    db.delete(goal)
    db.commit()


def add_contribution(db: Session, user_id: uuid.UUID, goal_id: uuid.UUID, data: ContributionCreate) -> GoalContribution:
    goal = get_goal(db, user_id, goal_id)
    contribution = GoalContribution(goal_id=goal.id, user_id=user_id, amount=data.amount, date=data.date)
    goal.saved_amount = float(goal.saved_amount) + data.amount
    db.add(contribution)
    db.commit()
    db.refresh(contribution)
    return contribution


def enrich_goal(goal: Goal) -> dict:
    saved = float(goal.saved_amount)
    target = float(goal.target_amount)
    return {
        **{c.key: getattr(goal, c.key) for c in goal.__table__.columns},
        "progress_percent": goal_progress_percent(saved, target),
        "monthly_needed": monthly_amount_needed(target, saved, goal.target_date),
        "months_remaining": months_remaining(goal.target_date),
    }
