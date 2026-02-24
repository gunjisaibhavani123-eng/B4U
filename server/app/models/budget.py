import uuid

from sqlalchemy import Enum, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import GUID, Base, TimestampMixin, UUIDMixin
from app.models.expense import ExpenseCategory


class Budget(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "budgets"
    __table_args__ = (UniqueConstraint("user_id", "month", "year", name="uq_user_month_year"),)

    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    total_income: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)

    categories = relationship("BudgetCategory", back_populates="budget", cascade="all, delete-orphan")


class BudgetCategory(Base, UUIDMixin):
    __tablename__ = "budget_categories"
    __table_args__ = (UniqueConstraint("budget_id", "category", name="uq_budget_category"),)

    budget_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("budgets.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("users.id"), nullable=False)
    category: Mapped[ExpenseCategory] = mapped_column(Enum(ExpenseCategory), nullable=False)
    allocated_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)

    budget = relationship("Budget", back_populates="categories")
