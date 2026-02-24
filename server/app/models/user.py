import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin


class DependentType(str, enum.Enum):
    JUST_ME = "JUST_ME"
    ME_SPOUSE = "ME_SPOUSE"
    ME_SPOUSE_KIDS = "ME_SPOUSE_KIDS"
    ME_PARENTS = "ME_PARENTS"
    ME_SPOUSE_PARENTS = "ME_SPOUSE_PARENTS"


class FixedExpenseCategory(str, enum.Enum):
    RENT = "RENT"
    EMI = "EMI"
    BILLS = "BILLS"
    OTHER_FIXED = "OTHER_FIXED"


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    phone: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    city: Mapped[str | None] = mapped_column(String(100), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    monthly_salary: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    other_income: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    dependent_type: Mapped[DependentType | None] = mapped_column(
        Enum(DependentType), nullable=True
    )
    onboarding_complete: Mapped[bool] = mapped_column(Boolean, default=False)

    fixed_expenses = relationship("FixedExpense", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")


class FixedExpense(Base, UUIDMixin):
    __tablename__ = "fixed_expenses"
    __table_args__ = (UniqueConstraint("user_id", "category", name="uq_user_fixed_category"),)

    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    category: Mapped[FixedExpenseCategory] = mapped_column(Enum(FixedExpenseCategory), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)

    user = relationship("User", back_populates="fixed_expenses")


class RefreshToken(Base, UUIDMixin):
    __tablename__ = "refresh_tokens"

    token: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user = relationship("User", back_populates="refresh_tokens")
