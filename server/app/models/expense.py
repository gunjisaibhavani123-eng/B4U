import enum
import uuid
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, Index, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin


class ExpenseCategory(str, enum.Enum):
    FOOD_DINING = "FOOD_DINING"
    GROCERIES = "GROCERIES"
    TRANSPORT = "TRANSPORT"
    SHOPPING = "SHOPPING"
    ENTERTAINMENT = "ENTERTAINMENT"
    BILLS = "BILLS"
    HEALTH = "HEALTH"
    EDUCATION_EXP = "EDUCATION_EXP"
    PERSONAL_CARE = "PERSONAL_CARE"
    GIFTS_DONATIONS = "GIFTS_DONATIONS"
    OTHER = "OTHER"


class Expense(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "expenses"
    __table_args__ = (
        Index("ix_expenses_user_date", "user_id", "date"),
        Index("ix_expenses_user_category", "user_id", "category"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    category: Mapped[ExpenseCategory] = mapped_column(Enum(ExpenseCategory), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    date: Mapped[date] = mapped_column(Date, nullable=False)
