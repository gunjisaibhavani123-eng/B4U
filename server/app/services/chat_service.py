import uuid
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.budget import Budget, BudgetCategory
from app.models.challenge import ChallengeStatus, UserChallenge
from app.models.chat import ChatMessage
from app.models.expense import Expense
from app.models.goal import Goal
from app.models.user import User


def get_history(db: Session, user_id: uuid.UUID, limit: int = 50) -> list[ChatMessage]:
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
        .all()
    )


def send_message(
    db: Session, user_id: uuid.UUID, content: str
) -> tuple[ChatMessage, ChatMessage]:
    user_msg = ChatMessage(user_id=user_id, role="user", content=content)
    db.add(user_msg)
    db.flush()

    reply_text = _generate_response(db, user_id, content)
    bot_msg = ChatMessage(user_id=user_id, role="bot", content=reply_text)
    db.add(bot_msg)
    db.commit()
    db.refresh(user_msg)
    db.refresh(bot_msg)
    return user_msg, bot_msg


def clear_history(db: Session, user_id: uuid.UUID) -> None:
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
    db.commit()


# ---------------------------------------------------------------------------
# Intent detection & response generation
# ---------------------------------------------------------------------------

def _generate_response(db: Session, user_id: uuid.UUID, question: str) -> str:
    q = question.lower()

    if any(w in q for w in ["hi", "hello", "hey", "howdy"]):
        return _greeting(db, user_id)

    if any(w in q for w in ["spend", "spent", "expense", "expenses", "spending"]):
        return _spending_response(db, user_id)

    if any(w in q for w in ["budget"]):
        return _budget_response(db, user_id)

    if any(w in q for w in ["goal", "saving", "save", "target"]):
        return _goal_response(db, user_id)

    if any(w in q for w in ["challenge"]):
        return _challenge_response(db, user_id)

    if any(w in q for w in ["income", "salary", "earn", "earning"]):
        return _income_response(db, user_id)

    if any(w in q for w in ["invest", "investment", "stock", "mutual fund", "sip"]):
        return _investment_advice()

    return _fallback_response()


# ---------------------------------------------------------------------------
# Individual response builders
# ---------------------------------------------------------------------------

def _greeting(db: Session, user_id: uuid.UUID) -> str:
    user = db.query(User).filter(User.id == user_id).first()
    name = user.name.split()[0] if user and user.name else "there"
    return (
        f"Hi {name}! I'm your B4U financial advisor. "
        "You can ask me about your spending, budget, goals, challenges, or income. "
        "What would you like to know?"
    )


def _spending_response(db: Session, user_id: uuid.UUID) -> str:
    today = date.today()
    first_of_month = today.replace(day=1)

    total = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == user_id,
            Expense.date >= first_of_month,
            Expense.date <= today,
        )
        .scalar()
    )
    total = float(total)

    # Top category this month
    top_row = (
        db.query(Expense.category, func.sum(Expense.amount).label("cat_total"))
        .filter(
            Expense.user_id == user_id,
            Expense.date >= first_of_month,
            Expense.date <= today,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .first()
    )

    month_name = today.strftime("%B")
    if total == 0:
        return f"You haven't recorded any expenses in {month_name} yet. Start tracking to get insights!"

    msg = f"You've spent \u20b9{total:,.2f} so far in {month_name}."
    if top_row:
        cat_label = top_row.category.value.replace("_", " ").title()
        msg += f" Your top category is {cat_label} (\u20b9{float(top_row.cat_total):,.2f})."
    msg += " Keep tracking to stay on top of your finances!"
    return msg


def _budget_response(db: Session, user_id: uuid.UUID) -> str:
    today = date.today()
    first_of_month = today.replace(day=1)

    budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id,
            Budget.month == today.month,
            Budget.year == today.year,
        )
        .first()
    )
    if not budget:
        return (
            "You haven't set a budget for this month yet. "
            "Head to the Budget Planner to set one up!"
        )

    # Total allocated
    allocated = (
        db.query(func.coalesce(func.sum(BudgetCategory.allocated_amount), 0))
        .filter(BudgetCategory.budget_id == budget.id)
        .scalar()
    )
    allocated = float(allocated)

    # Total spent
    spent = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == user_id,
            Expense.date >= first_of_month,
            Expense.date <= today,
        )
        .scalar()
    )
    spent = float(spent)

    remaining = allocated - spent
    month_name = today.strftime("%B")

    if remaining >= 0:
        return (
            f"Great news! In {month_name} your budget is \u20b9{allocated:,.2f} and you've spent "
            f"\u20b9{spent:,.2f}, leaving \u20b9{remaining:,.2f} remaining. You're on track!"
        )
    else:
        over = abs(remaining)
        return (
            f"Heads up! In {month_name} you've spent \u20b9{spent:,.2f} against a budget of "
            f"\u20b9{allocated:,.2f}. You're \u20b9{over:,.2f} over budget. "
            "Consider cutting back on discretionary spending."
        )


def _goal_response(db: Session, user_id: uuid.UUID) -> str:
    goals = (
        db.query(Goal)
        .filter(Goal.user_id == user_id, Goal.is_active == True)
        .order_by(Goal.created_at.desc())
        .all()
    )
    if not goals:
        return (
            "You don't have any active savings goals. "
            "Set one up in the Goals section to start working toward something meaningful!"
        )

    goal = goals[0]
    target = float(goal.target_amount)
    saved = float(goal.saved_amount)
    remaining = max(0, target - saved)
    pct = min(100, (saved / target * 100)) if target > 0 else 0

    msg = (
        f"Your top goal is \"{goal.name}\": you've saved \u20b9{saved:,.2f} of "
        f"\u20b9{target:,.2f} ({pct:.1f}% complete), with \u20b9{remaining:,.2f} left to go."
    )
    if len(goals) > 1:
        msg += f" You have {len(goals)} active goals in total."
    return msg


def _challenge_response(db: Session, user_id: uuid.UUID) -> str:
    active_ucs = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == ChallengeStatus.ACTIVE,
        )
        .all()
    )
    if not active_ucs:
        return (
            "You're not in any challenges right now. "
            "Check out the Challenges section to join one and earn badges!"
        )

    uc = active_ucs[0]
    challenge = uc.challenge
    today = date.today()
    days_left = max(0, (uc.end_date - today).days)

    msg = (
        f"You're currently in the \"{challenge.title}\" challenge with {days_left} day(s) remaining."
    )
    if len(active_ucs) > 1:
        msg += f" You have {len(active_ucs)} active challenges in total."
    msg += " Keep it up!"
    return msg


def _income_response(db: Session, user_id: uuid.UUID) -> str:
    user = db.query(User).filter(User.id == user_id).first()
    if not user or (not user.monthly_salary and not user.other_income):
        return (
            "I don't have your income details on file. "
            "Update your profile to get income-based insights."
        )

    salary = float(user.monthly_salary or 0)
    other = float(user.other_income or 0)
    total = salary + other

    parts = []
    if salary:
        parts.append(f"monthly salary of \u20b9{salary:,.2f}")
    if other:
        parts.append(f"other income of \u20b9{other:,.2f}")

    return (
        f"Your total monthly income is \u20b9{total:,.2f} "
        f"({' + '.join(parts)}). "
        "A good rule of thumb is to save at least 20% of your income each month."
    )


def _investment_advice() -> str:
    return (
        "Great question! Here are some general investment tips:\n"
        "• Start with an emergency fund covering 3-6 months of expenses.\n"
        "• Consider SIPs in diversified mutual funds for long-term wealth building.\n"
        "• Look at PPF or NPS for tax-saving investments.\n"
        "• Only invest in equities money you won't need for at least 5 years.\n"
        "Always consult a certified financial advisor before making investment decisions."
    )


def _fallback_response() -> str:
    return (
        "That's a great question! Here are some financial tips to get you started:\n"
        "• Track every expense — awareness is the first step to control.\n"
        "• Follow the 50-30-20 rule: 50% needs, 30% wants, 20% savings.\n"
        "• Pay yourself first — automate your savings.\n"
        "• Review your budget monthly and adjust as needed.\n"
        "You can also ask me about your spending, budget, goals, or challenges!"
    )
