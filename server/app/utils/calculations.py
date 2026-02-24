import math
from datetime import date


def months_remaining(target_date: date) -> int:
    today = date.today()
    months = (target_date.year - today.year) * 12 + (target_date.month - today.month)
    return max(months, 0)


def monthly_amount_needed(target: float, saved: float, target_date: date) -> float:
    remaining = target - saved
    if remaining <= 0:
        return 0
    months = months_remaining(target_date)
    if months <= 0:
        return remaining
    return math.ceil(remaining / months)


def days_remaining_in_month() -> int:
    today = date.today()
    if today.month == 12:
        last_day = date(today.year + 1, 1, 1)
    else:
        last_day = date(today.year, today.month + 1, 1)
    return (last_day - today).days


def goal_progress_percent(saved: float, target: float) -> int:
    if target <= 0:
        return 0
    return min(int((saved / target) * 100), 100)
