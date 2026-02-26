import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.challenge import ChallengeStatus
from app.models.user import User
from app.schemas.challenge import (
    ChallengeListResponse,
    LeaderboardResponse,
    UserChallengeCreate,
    UserChallengeListResponse,
    UserChallengeResponse,
    UserProgressResponse,
)
from app.services.challenge_service import (
    abandon_challenge,
    calculate_challenge_progress,
    check_and_complete_challenge,
    get_leaderboard,
    get_user_challenge,
    get_user_progress,
    join_challenge,
    list_available_challenges,
    list_user_challenges,
)

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.get("", response_model=ChallengeListResponse)
def get_challenges(db: Session = Depends(get_db)):
    items, total = list_available_challenges(db)
    return {"items": items, "total": total}


@router.post("/join", response_model=UserChallengeResponse, status_code=201)
def post_join_challenge(
    body: UserChallengeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    uc = join_challenge(db, user.id, body.challenge_id)
    progress = calculate_challenge_progress(db, uc)
    return {
        "id": uc.id,
        "user_id": uc.user_id,
        "challenge_id": uc.challenge_id,
        "status": uc.status,
        "start_date": uc.start_date,
        "end_date": uc.end_date,
        "completed_at": uc.completed_at,
        "challenge": uc.challenge,
        "created_at": uc.created_at,
        **progress,
    }


@router.get("/my-challenges", response_model=UserChallengeListResponse)
def get_my_challenges(
    status: ChallengeStatus | None = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, total = list_user_challenges(db, user.id, status)
    result = []
    for uc in items:
        check_and_complete_challenge(db, uc)
        progress = calculate_challenge_progress(db, uc)
        result.append(
            {
                "id": uc.id,
                "user_id": uc.user_id,
                "challenge_id": uc.challenge_id,
                "status": uc.status,
                "start_date": uc.start_date,
                "end_date": uc.end_date,
                "completed_at": uc.completed_at,
                "challenge": uc.challenge,
                "created_at": uc.created_at,
                **progress,
            }
        )
    return {"items": result, "total": total}


@router.get("/my-progress", response_model=UserProgressResponse)
def get_progress(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_user_progress(db, user.id)


@router.get("/my-challenges/{user_challenge_id}", response_model=UserChallengeResponse)
def get_my_challenge_detail(
    user_challenge_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    uc = get_user_challenge(db, user.id, user_challenge_id)
    check_and_complete_challenge(db, uc)
    progress = calculate_challenge_progress(db, uc)
    return {
        "id": uc.id,
        "user_id": uc.user_id,
        "challenge_id": uc.challenge_id,
        "status": uc.status,
        "start_date": uc.start_date,
        "end_date": uc.end_date,
        "completed_at": uc.completed_at,
        "challenge": uc.challenge,
        "created_at": uc.created_at,
        **progress,
    }


@router.get("/{challenge_id}/leaderboard", response_model=LeaderboardResponse)
def get_challenge_leaderboard(
    challenge_id: uuid.UUID,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_leaderboard(db, challenge_id, user.id, limit)


@router.delete("/my-challenges/{user_challenge_id}", status_code=204)
def delete_my_challenge(
    user_challenge_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    abandon_challenge(db, user.id, user_challenge_id)
