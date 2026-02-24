export const CHECKLIST_CONTENT = {
  EMERGENCY_FUND: {
    title: 'Emergency Fund',
    emoji: '🏦',
    why: 'An emergency fund covers unexpected expenses like medical bills, job loss, or urgent repairs. Without one, you may need to borrow at high interest.',
    what: 'Save 3-6 months of your monthly expenses in a separate savings account or liquid fund.',
    tips: [
      'Start with 1 month of expenses, then build up',
      'Keep it in a savings account or liquid mutual fund',
      'Don\'t invest this in stocks or locked deposits',
    ],
    fields: [
      { name: 'amount', label: 'Amount saved so far', type: 'number', prefix: '₹' },
      { name: 'account', label: 'Where is it kept?', type: 'text', placeholder: 'e.g., SBI Savings Account' },
    ],
  },
  HEALTH_INSURANCE: {
    title: 'Health Insurance',
    emoji: '🏥',
    why: 'One hospital visit can wipe out years of savings. Health insurance protects you and your family from catastrophic medical costs.',
    what: 'Get a health insurance policy with at least ₹5 lakh coverage for yourself and your family.',
    tips: [
      'Prefer a family floater plan if you have dependents',
      'Go for at least ₹5L cover, ₹10L is ideal',
      'Check if your employer provides any coverage',
    ],
    fields: [
      { name: 'provider', label: 'Insurance company', type: 'text', placeholder: 'e.g., Star Health' },
      { name: 'cover_amount', label: 'Coverage amount', type: 'number', prefix: '₹' },
    ],
  },
  TERM_INSURANCE: {
    title: 'Term Insurance',
    emoji: '🛡️',
    why: 'Term insurance ensures your family is financially protected if something happens to you. It\'s the most affordable way to get high coverage.',
    what: 'Get term insurance cover of 10-15x your annual income.',
    tips: [
      'Buy as early as possible — premiums are lowest when you\'re young',
      'Cover should be 10-15x annual income',
      'Only needed if someone depends on your income',
    ],
    fields: [
      { name: 'provider', label: 'Insurance company', type: 'text', placeholder: 'e.g., ICICI Prudential' },
      { name: 'cover_amount', label: 'Coverage amount', type: 'number', prefix: '₹' },
    ],
  },
  EPF_PPF: {
    title: 'EPF / PPF',
    emoji: '💰',
    why: 'EPF and PPF are safe, tax-saving retirement instruments. They offer guaranteed returns and help you build a long-term corpus.',
    what: 'Contribute regularly to EPF (if salaried) or open a PPF account and invest at least ₹500/month.',
    tips: [
      'EPF is automatically deducted for salaried employees',
      'PPF has a 15-year lock-in but great tax benefits',
      'Consider VPF for extra retirement savings',
    ],
    fields: [
      { name: 'type', label: 'EPF or PPF?', type: 'text', placeholder: 'e.g., EPF' },
      { name: 'monthly', label: 'Monthly contribution', type: 'number', prefix: '₹' },
    ],
  },
  BASIC_SAVINGS_HABIT: {
    title: 'Basic Savings Habit',
    emoji: '💵',
    why: 'Saving consistently, even small amounts, builds financial discipline and creates a safety net over time.',
    what: 'Save at least 10% of your income every month.',
    tips: [
      'Automate transfers on salary day',
      'Start with 10%, increase by 1% every few months',
      'Use a separate account so you don\'t spend it',
    ],
    fields: [
      { name: 'monthly_savings', label: 'Monthly savings amount', type: 'number', prefix: '₹' },
      { name: 'method', label: 'How do you save?', type: 'text', placeholder: 'e.g., Auto-transfer to RD' },
    ],
  },
  NO_HIGH_INTEREST_DEBT: {
    title: 'No High-Interest Debt',
    emoji: '✅',
    why: 'Credit card debt and personal loans at 15-40% interest eat into your income. Clearing them is the best "investment" you can make.',
    what: 'Clear all credit card dues and personal loans. Avoid borrowing at interest rates above 12%.',
    tips: [
      'Pay credit card bills in full every month',
      'Prioritize highest interest debt first',
      'Consider balance transfer if stuck with high-interest EMIs',
    ],
    fields: [
      { name: 'has_debt', label: 'Any high-interest debt?', type: 'text', placeholder: 'No / Yes (amount)' },
    ],
  },
};
