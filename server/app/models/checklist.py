import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin


class ChecklistItemType(str, enum.Enum):
    EMERGENCY_FUND = "EMERGENCY_FUND"
    HEALTH_INSURANCE = "HEALTH_INSURANCE"
    TERM_INSURANCE = "TERM_INSURANCE"
    EPF_PPF = "EPF_PPF"
    BASIC_SAVINGS_HABIT = "BASIC_SAVINGS_HABIT"
    NO_HIGH_INTEREST_DEBT = "NO_HIGH_INTEREST_DEBT"


class ChecklistStatus(str, enum.Enum):
    COMPLETE = "COMPLETE"
    INCOMPLETE = "INCOMPLETE"
    MISSING = "MISSING"


class UserChecklistItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_checklist_items"
    __table_args__ = (UniqueConstraint("user_id", "item_type", name="uq_user_checklist_item"),)

    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    item_type: Mapped[ChecklistItemType] = mapped_column(Enum(ChecklistItemType), nullable=False)
    status: Mapped[ChecklistStatus] = mapped_column(Enum(ChecklistStatus), default=ChecklistStatus.MISSING)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
