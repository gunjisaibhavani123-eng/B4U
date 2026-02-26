import uuid
from datetime import date, datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.challenge import (
    BadgeType,
    Challenge,
    ChallengeStatus,
    ChallengeType,
    UserBadge,
    UserChallenge,
)
from app.models.expense import Expense
from app.models.goal import GoalContribution


def list_available_challenges(db: Session) -> tuple[list[Challenge], int]:
    query = db.query(Challenge).filter(Challenge.is_active == True)
    total = query.count()
    items = query.order_by(Challenge.created_at.asc()).all()
    return items, total


def join_challenge(
    db: Session, user_id: uuid.UUID, challenge_id: uuid.UUID
) -> UserChallenge:
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found"
        )

    existing = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.challenge_id == challenge_id,
            UserChallenge.status == ChallengeStatus.ACTIVE,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already joined this challenge",
        )

    today = date.today()
    user_challenge = UserChallenge(
        user_id=user_id,
        challenge_id=challenge_id,
        status=ChallengeStatus.ACTIVE,
        start_date=today,
        end_date=today + timedelta(days=challenge.duration_days),
    )
    db.add(user_challenge)
    db.commit()
    db.refresh(user_challenge)
    return user_challenge


def list_user_challenges(
    db: Session, user_id: uuid.UUID, status_filter: ChallengeStatus | None = None
) -> tuple[list[UserChallenge], int]:
    query = db.query(UserChallenge).filter(UserChallenge.user_id == user_id)
    if status_filter:
        query = query.filter(UserChallenge.status == status_filter)
    total = query.count()
    items = query.order_by(UserChallenge.created_at.desc()).all()
    return items, total


def get_user_challenge(
    db: Session, user_id: uuid.UUID, user_challenge_id: uuid.UUID
) -> UserChallenge:
    uc = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.id == user_challenge_id, UserChallenge.user_id == user_id
        )
        .first()
    )
    if not uc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found"
        )
    return uc


def calculate_challenge_progress(
    db: Session, user_challenge: UserChallenge
) -> dict:
    challenge = user_challenge.challenge
    start = user_challenge.start_date
    today = date.today()
    end = user_challenge.end_date
    effective_end = min(today, end)

    progress_percent = 0.0
    current_value = 0.0
    target_value = float(challenge.target_amount or challenge.duration_days)
    is_completed = False

    if challenge.challenge_type == ChallengeType.SAVINGS:
        saved = (
            db.query(func.coalesce(func.sum(GoalContribution.amount), 0))
            .filter(
                GoalContribution.user_id == user_challenge.user_id,
                GoalContribution.date >= start,
                GoalContribution.date <= effective_end,
            )
            .scalar()
        )
        current_value = float(saved)
        target_value = float(challenge.target_amount or 0)
        if target_value > 0:
            progress_percent = min(100, (current_value / target_value) * 100)
        is_completed = current_value >= target_value

    elif challenge.challenge_type == ChallengeType.SPENDING_LIMIT:
        spent = (
            db.query(func.coalesce(func.sum(Expense.amount), 0))
            .filter(
                Expense.user_id == user_challenge.user_id,
                Expense.date >= start,
                Expense.date <= effective_end,
            )
        )
        if challenge.target_category:
            spent = spent.filter(Expense.category == challenge.target_category)
        spent = float(spent.scalar())
        current_value = spent
        target_value = float(challenge.target_amount or 0)
        if target_value > 0:
            progress_percent = max(0, 100 - (spent / target_value) * 100)
        is_completed = today >= end and spent <= target_value

    elif challenge.challenge_type == ChallengeType.NO_SPEND:
        count = (
            db.query(func.count(Expense.id))
            .filter(
                Expense.user_id == user_challenge.user_id,
                Expense.date >= start,
                Expense.date <= effective_end,
            )
        )
        if challenge.target_category:
            count = count.filter(Expense.category == challenge.target_category)
        count = int(count.scalar())
        current_value = float(count)
        target_value = 0.0
        progress_percent = 100.0 if count == 0 else 0.0
        is_completed = today >= end and count == 0

    elif challenge.challenge_type == ChallengeType.STREAK:
        dates = (
            db.query(Expense.date)
            .filter(
                Expense.user_id == user_challenge.user_id,
                Expense.date >= start,
                Expense.date <= effective_end,
            )
            .distinct()
            .order_by(Expense.date.asc())
            .all()
        )
        expense_dates = sorted({d[0] for d in dates})
        consecutive = _count_consecutive_days(expense_dates, start)
        current_value = float(consecutive)
        target_value = float(challenge.duration_days)
        if target_value > 0:
            progress_percent = min(100, (consecutive / target_value) * 100)
        is_completed = consecutive >= challenge.duration_days

    return {
        "progress_percent": round(progress_percent, 1),
        "current_value": round(current_value, 2),
        "target_value": round(target_value, 2),
        "is_completed": is_completed,
    }


def _count_consecutive_days(expense_dates: list[date], start_date: date) -> int:
    if not expense_dates:
        return 0
    consecutive = 0
    expected = start_date
    for d in expense_dates:
        if d == expected:
            consecutive += 1
            expected = d + timedelta(days=1)
        elif d > expected:
            break
    return consecutive


def check_and_complete_challenge(db: Session, user_challenge: UserChallenge) -> UserChallenge:
    if user_challenge.status != ChallengeStatus.ACTIVE:
        return user_challenge

    progress = calculate_challenge_progress(db, user_challenge)
    today = date.today()

    if progress["is_completed"]:
        user_challenge.status = ChallengeStatus.COMPLETED
        user_challenge.completed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(user_challenge)
        award_badge(db, user_challenge.user_id, user_challenge)
    elif today > user_challenge.end_date:
        user_challenge.status = ChallengeStatus.FAILED
        db.commit()
        db.refresh(user_challenge)

    return user_challenge


def award_badge(
    db: Session, user_id: uuid.UUID, user_challenge: UserChallenge
) -> UserBadge | None:
    badge_type = user_challenge.challenge.badge_type
    existing = (
        db.query(UserBadge)
        .filter(UserBadge.user_id == user_id, UserBadge.badge_type == badge_type)
        .first()
    )
    if existing:
        return existing

    badge = UserBadge(
        user_id=user_id,
        badge_type=badge_type,
        challenge_id=user_challenge.challenge_id,
        earned_at=datetime.now(timezone.utc),
    )
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge


def get_leaderboard(
    db: Session, challenge_id: uuid.UUID, current_user_id: uuid.UUID, limit: int = 10
) -> dict:
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found"
        )

    user_challenges = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.challenge_id == challenge_id,
            UserChallenge.status.in_(
                [ChallengeStatus.ACTIVE, ChallengeStatus.COMPLETED]
            ),
        )
        .all()
    )

    entries = []
    for uc in user_challenges:
        progress = calculate_challenge_progress(db, uc)
        entries.append(
            {
                "user_id": uc.user_id,
                "progress_percent": progress["progress_percent"],
            }
        )

    entries.sort(key=lambda x: x["progress_percent"], reverse=True)
    entries = entries[:limit]

    leaderboard_entries = []
    for i, entry in enumerate(entries):
        user_hash = hash(str(entry["user_id"])) % 10000
        leaderboard_entries.append(
            {
                "rank": i + 1,
                "progress_percent": entry["progress_percent"],
                "is_current_user": entry["user_id"] == current_user_id,
                "anonymous_name": f"User #{abs(user_hash):04d}",
            }
        )

    return {
        "challenge_id": challenge_id,
        "challenge_title": challenge.title,
        "entries": leaderboard_entries,
        "total_participants": len(user_challenges),
    }


def get_user_progress(db: Session, user_id: uuid.UUID) -> dict:
    active_ucs, _ = list_user_challenges(db, user_id, ChallengeStatus.ACTIVE)

    for uc in active_ucs:
        check_and_complete_challenge(db, uc)

    active_ucs, _ = list_user_challenges(db, user_id, ChallengeStatus.ACTIVE)
    completed_count = (
        db.query(func.count(UserChallenge.id))
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == ChallengeStatus.COMPLETED,
        )
        .scalar()
    )

    badges = db.query(UserBadge).filter(UserBadge.user_id == user_id).all()

    active_with_progress = []
    for uc in active_ucs:
        progress = calculate_challenge_progress(db, uc)
        active_with_progress.append(
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

    badge_responses = []
    for b in badges:
        badge_responses.append(
            {
                "badge_type": b.badge_type,
                "earned_at": b.earned_at,
                "challenge_title": b.challenge.title,
            }
        )

    return {
        "active_challenges": active_with_progress,
        "completed_count": completed_count,
        "badges": badge_responses,
    }


def abandon_challenge(
    db: Session, user_id: uuid.UUID, user_challenge_id: uuid.UUID
) -> None:
    uc = get_user_challenge(db, user_id, user_challenge_id)
    if uc.status != ChallengeStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only abandon active challenges",
        )
    uc.status = ChallengeStatus.ABANDONED
    db.commit()
