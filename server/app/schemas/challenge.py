import uuid
from datetime import date, datetime

from pydantic import BaseModel

from app.models.challenge import BadgeType, ChallengeStatus, ChallengeType
from app.models.expense import ExpenseCategory


class ChallengeResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    challenge_type: ChallengeType
    target_category: ExpenseCategory | None
    target_amount: float | None
    duration_days: int
    badge_type: BadgeType
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ChallengeListResponse(BaseModel):
    items: list[ChallengeResponse]
    total: int


class UserChallengeCreate(BaseModel):
    challenge_id: uuid.UUID


class UserChallengeResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    challenge_id: uuid.UUID
    status: ChallengeStatus
    start_date: date
    end_date: date
    completed_at: datetime | None
    challenge: ChallengeResponse
    progress_percent: float
    current_value: float
    target_value: float
    created_at: datetime

    model_config = {"from_attributes": True}


class UserChallengeListResponse(BaseModel):
    items: list[UserChallengeResponse]
    total: int


class LeaderboardEntry(BaseModel):
    rank: int
    progress_percent: float
    is_current_user: bool
    anonymous_name: str


class LeaderboardResponse(BaseModel):
    challenge_id: uuid.UUID
    challenge_title: str
    entries: list[LeaderboardEntry]
    total_participants: int


class UserBadgeResponse(BaseModel):
    badge_type: BadgeType
    earned_at: datetime
    challenge_title: str

    model_config = {"from_attributes": True}


class UserProgressResponse(BaseModel):
    active_challenges: list[UserChallengeResponse]
    completed_count: int
    badges: list[UserBadgeResponse]
