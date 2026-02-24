def format_inr(amount: float) -> str:
    """Format a number in Indian Rupee format (e.g., 1,00,000)."""
    if amount < 0:
        return f"-{format_inr(-amount)}"
    amount = int(round(amount))
    s = str(amount)
    if len(s) <= 3:
        return f"\u20b9{s}"
    last_three = s[-3:]
    remaining = s[:-3]
    groups = []
    while remaining:
        groups.insert(0, remaining[-2:])
        remaining = remaining[:-2]
    return f"\u20b9{','.join(groups)},{last_three}"
