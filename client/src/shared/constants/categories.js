export const EXPENSE_CATEGORIES = {
  FOOD_DINING: { label: 'Food & Dining', emoji: '\uD83C\uDF55', color: '#ef4444' },
  GROCERIES: { label: 'Groceries', emoji: '\uD83D\uDED2', color: '#f97316' },
  TRANSPORT: { label: 'Transport', emoji: '\uD83D\uDE97', color: '#3b82f6' },
  SHOPPING: { label: 'Shopping', emoji: '\uD83D\uDECD\uFE0F', color: '#8b5cf6' },
  ENTERTAINMENT: { label: 'Entertainment', emoji: '\uD83C\uDFAC', color: '#ec4899' },
  BILLS: { label: 'Bills', emoji: '\uD83D\uDCF1', color: '#06b6d4' },
  HEALTH: { label: 'Health', emoji: '\uD83D\uDC8A', color: '#10b981' },
  EDUCATION_EXP: { label: 'Education', emoji: '\uD83C\uDF93', color: '#6366f1' },
  PERSONAL_CARE: { label: 'Personal Care', emoji: '\uD83D\uDC87', color: '#f43f5e' },
  GIFTS_DONATIONS: { label: 'Gifts', emoji: '\uD83C\uDF81', color: '#a855f7' },
  OTHER: { label: 'Other', emoji: '\u2022\u2022\u2022', color: '#6b7280' },
};

export const GOAL_ICONS = {
  BIKE: { label: 'Bike', emoji: '\uD83C\uDFCD\uFE0F' },
  CAR: { label: 'Car', emoji: '\uD83D\uDE97' },
  HOME: { label: 'Home', emoji: '\uD83C\uDFE0' },
  TRIP: { label: 'Trip', emoji: '\uD83C\uDFD6\uFE0F' },
  WEDDING: { label: 'Wedding', emoji: '\uD83D\uDC8D' },
  GADGET: { label: 'Gadget', emoji: '\uD83D\uDCF1' },
  EDUCATION_GOAL: { label: 'Education', emoji: '\uD83C\uDF93' },
  OTHER_GOAL: { label: 'Other', emoji: '\u2728' },
};

export const DEPENDENT_TYPES = {
  JUST_ME: { label: 'Just me', description: 'Single, no dependents' },
  ME_SPOUSE: { label: 'Me + Spouse', description: 'Married, no kids' },
  ME_SPOUSE_KIDS: { label: 'Me + Spouse + Kids', description: 'Family with children' },
  ME_PARENTS: { label: 'Me + Parents', description: 'Supporting parents' },
  ME_SPOUSE_PARENTS: { label: 'Me + Spouse + Parents', description: 'Extended family' },
};

export const FIXED_EXPENSE_CATEGORIES = {
  RENT: { label: 'Rent / Housing', emoji: '\uD83C\uDFE0' },
  EMI: { label: 'EMIs (Loan payments)', emoji: '\uD83D\uDCB3' },
  BILLS: { label: 'Bills (Electricity, WiFi, etc.)', emoji: '\uD83D\uDCF1' },
  OTHER_FIXED: { label: 'Other fixed expenses', emoji: '\uD83D\uDCCB' },
};

export const CHECKLIST_ITEMS = {
  EMERGENCY_FUND: { label: 'Emergency Fund', emoji: '\uD83C\uDFE6', category: 'MUST HAVE' },
  HEALTH_INSURANCE: { label: 'Health Insurance', emoji: '\uD83C\uDFE5', category: 'MUST HAVE' },
  TERM_INSURANCE: { label: 'Term Insurance', emoji: '\uD83D\uDEE1\uFE0F', category: 'MUST HAVE' },
  EPF_PPF: { label: 'EPF/PPF', emoji: '\uD83D\uDCB0', category: 'IMPORTANT' },
  BASIC_SAVINGS_HABIT: { label: 'Basic Savings Habit', emoji: '\uD83D\uDCB5', category: 'IMPORTANT' },
  NO_HIGH_INTEREST_DEBT: { label: 'No High-Interest Debt', emoji: '\u2705', category: 'IMPORTANT' },
};
