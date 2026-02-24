import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.user import User
from app.schemas.goal import ContributionCreate, ContributionResponse, GoalCreate, GoalDetailResponse, GoalResponse, GoalUpdate
from app.services.goal_service import add_contribution, create_goal, delete_goal, enrich_goal, get_goal, list_goals, update_goal

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("", response_model=list[GoalResponse])
def get_goals(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goals = list_goals(db, user.id)
    return [enrich_goal(g) for g in goals]


@router.post("", response_model=GoalResponse, status_code=201)
def post_goal(body: GoalCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = create_goal(db, user.id, body)
    return enrich_goal(goal)


@router.get("/{goal_id}", response_model=GoalDetailResponse)
def get_single(goal_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = get_goal(db, user.id, goal_id)
    data = enrich_goal(goal)
    data["contributions"] = goal.contributions
    return data


@router.patch("/{goal_id}", response_model=GoalResponse)
def patch_goal(goal_id: uuid.UUID, body: GoalUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = update_goal(db, user.id, goal_id, body)
    return enrich_goal(goal)


@router.delete("/{goal_id}", status_code=204)
def del_goal(goal_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    delete_goal(db, user.id, goal_id)


@router.post("/{goal_id}/contributions", response_model=ContributionResponse, status_code=201)
def post_contribution(goal_id: uuid.UUID, body: ContributionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return add_contribution(db, user.id, goal_id, body)
