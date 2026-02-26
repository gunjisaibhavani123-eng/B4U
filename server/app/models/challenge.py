import enum
import uuid

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin
from app.models.expense import ExpenseCategory


class ChallengeType(str, enum.Enum):
    SAVINGS = "SAVINGS"
    SPENDING_LIMIT = "SPENDING_LIMIT"
    NO_SPEND = "NO_SPEND"
    STREAK = "STREAK"


class ChallengeStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ABANDONED = "ABANDONED"


class BadgeType(str, enum.Enum):
    SAVINGS_MASTER = "SAVINGS_MASTER"
    BUDGET_NINJA = "BUDGET_NINJA"
    STREAK_CHAMPION = "STREAK_CHAMPION"
    SPENDING_WARRIOR = "SPENDING_WARRIOR"


class Challenge(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "challenges"

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    challenge_type: Mapped[ChallengeType] = mapped_column(
        Enum(ChallengeType), nullable=False
    )
    target_category: Mapped[ExpenseCategory | None] = mapped_column(
        Enum(ExpenseCategory), nullable=True
    )
    target_amount: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    duration_days: Mapped[int] = mapped_column(Integer, nullable=False)
    badge_type: Mapped[BadgeType] = mapped_column(Enum(BadgeType), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class UserChallenge(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_challenges"
    __table_args__ = (
        Index("ix_user_challenges_user_status", "user_id", "status"),
        Index("ix_user_challenges_challenge", "challenge_id"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("users.id"), nullable=False
    )
    challenge_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("challenges.id"), nullable=False
    )
    status: Mapped[ChallengeStatus] = mapped_column(
        Enum(ChallengeStatus), default=ChallengeStatus.ACTIVE
    )
    start_date: Mapped[str] = mapped_column(Date, nullable=False)
    end_date: Mapped[str] = mapped_column(Date, nullable=False)
    completed_at: Mapped[str | None] = mapped_column(DateTime(timezone=True), nullable=True)

    challenge = relationship("Challenge", lazy="joined")


class UserBadge(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_badges"
    __table_args__ = (
        UniqueConstraint("user_id", "badge_type", name="uq_user_badge"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("users.id"), nullable=False
    )
    badge_type: Mapped[BadgeType] = mapped_column(Enum(BadgeType), nullable=False)
    challenge_id: Mapped[uuid.UUID] = mapped_column(
        GUID, ForeignKey("challenges.id"), nullable=False
    )
    earned_at: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)

    challenge = relationship("Challenge", lazy="joined")
