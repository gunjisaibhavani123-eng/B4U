from sqlalchemy.orm import Session

from app.models.challenge import BadgeType, Challenge, ChallengeType
from app.models.expense import ExpenseCategory

SEED_CHALLENGES = [
    {
        "title": "30-Day Savings Sprint",
        "description": "Save ₹10,000 in 30 days by contributing to your goals regularly.",
        "challenge_type": ChallengeType.SAVINGS,
        "target_category": None,
        "target_amount": 10000,
        "duration_days": 30,
        "badge_type": BadgeType.SAVINGS_MASTER,
    },
    {
        "title": "No Shopping Challenge",
        "description": "Go 30 days without any shopping expenses. Can you resist the urge?",
        "challenge_type": ChallengeType.NO_SPEND,
        "target_category": ExpenseCategory.SHOPPING,
        "target_amount": None,
        "duration_days": 30,
        "badge_type": BadgeType.SPENDING_WARRIOR,
    },
    {
        "title": "Food Budget Master",
        "description": "Keep your food & dining expenses under ₹5,000 for 30 days.",
        "challenge_type": ChallengeType.SPENDING_LIMIT,
        "target_category": ExpenseCategory.FOOD_DINING,
        "target_amount": 5000,
        "duration_days": 30,
        "badge_type": BadgeType.BUDGET_NINJA,
    },
    {
        "title": "Expense Tracking Streak",
        "description": "Track your expenses every single day for 30 days straight.",
        "challenge_type": ChallengeType.STREAK,
        "target_category": None,
        "target_amount": None,
        "duration_days": 30,
        "badge_type": BadgeType.STREAK_CHAMPION,
    },
    {
        "title": "Emergency Fund Booster",
        "description": "Save ₹25,000 in 60 days to boost your emergency fund.",
        "challenge_type": ChallengeType.SAVINGS,
        "target_category": None,
        "target_amount": 25000,
        "duration_days": 60,
        "badge_type": BadgeType.SAVINGS_MASTER,
    },
]


def seed_challenges(db: Session) -> None:
    existing_count = db.query(Challenge).count()
    if existing_count > 0:
        return

    for data in SEED_CHALLENGES:
        challenge = Challenge(**data)
        db.add(challenge)

    db.commit()
