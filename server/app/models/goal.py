import enum
import uuid
from datetime import date

from sqlalchemy import Boolean, Date, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin


class GoalIcon(str, enum.Enum):
    BIKE = "BIKE"
    CAR = "CAR"
    HOME = "HOME"
    TRIP = "TRIP"
    WEDDING = "WEDDING"
    GADGET = "GADGET"
    EDUCATION_GOAL = "EDUCATION_GOAL"
    OTHER_GOAL = "OTHER_GOAL"


class Goal(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "goals"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[GoalIcon] = mapped_column(Enum(GoalIcon), nullable=False)
    target_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    saved_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    target_date: Mapped[date] = mapped_column(Date, nullable=False)
    initial_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    contributions = relationship("GoalContribution", back_populates="goal", cascade="all, delete-orphan")


class GoalContribution(Base, UUIDMixin):
    __tablename__ = "goal_contributions"

    goal_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("goals.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at = TimestampMixin.created_at

    goal = relationship("Goal", back_populates="contributions")
