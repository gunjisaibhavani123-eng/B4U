export const TOPICS = [
  {
    id: 'budgeting',
    title: 'Budgeting Basics',
    emoji: '📊',
    color: '#3b82f6',
    description: 'Learn to manage your money better',
    videos: [
      {
        id: 'budget-1',
        title: 'What is a Budget?',
        duration: '5 min',
        description: 'Understanding the basics of budgeting and why it matters.',
        takeaways: [
          'A budget is a plan for your money',
          'Track income vs expenses',
          'The 50/30/20 rule: Needs/Wants/Savings',
        ],
      },
      {
        id: 'budget-2',
        title: 'The 50/30/20 Rule',
        duration: '4 min',
        description: 'A simple framework to divide your income into needs, wants, and savings.',
        takeaways: [
          '50% for needs (rent, food, bills)',
          '30% for wants (shopping, entertainment)',
          '20% for savings and debt repayment',
        ],
      },
    ],
  },
  {
    id: 'saving',
    title: 'Smart Saving',
    emoji: '💰',
    color: '#22c55e',
    description: 'Build your savings habit',
    videos: [
      {
        id: 'save-1',
        title: 'Pay Yourself First',
        duration: '4 min',
        description: 'Why you should save before you spend.',
        takeaways: [
          'Save on salary day, not month-end',
          'Automate your savings',
          'Start small — even ₹500/month matters',
        ],
      },
      {
        id: 'save-2',
        title: 'Where to Keep Savings',
        duration: '6 min',
        description: 'Savings account vs FD vs liquid funds.',
        takeaways: [
          'Emergency fund: savings account or liquid fund',
          'Short-term goals: FD or RD',
          'Long-term: mutual funds or PPF',
        ],
      },
    ],
  },
  {
    id: 'debt',
    title: 'Managing Debt',
    emoji: '💳',
    color: '#ef4444',
    description: 'Get out of debt smartly',
    videos: [
      {
        id: 'debt-1',
        title: 'Good Debt vs Bad Debt',
        duration: '5 min',
        description: 'Not all debt is bad — learn the difference.',
        takeaways: [
          'Home loans and education loans can be good debt',
          'Credit card debt and personal loans are expensive',
          'Always check the interest rate before borrowing',
        ],
      },
      {
        id: 'debt-2',
        title: 'How to Get Out of Debt',
        duration: '6 min',
        description: 'Practical strategies to clear your dues.',
        takeaways: [
          'List all debts with interest rates',
          'Pay highest interest debt first (avalanche method)',
          'Or pay smallest debt first for momentum (snowball method)',
        ],
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance 101',
    emoji: '🛡️',
    color: '#8b5cf6',
    description: 'Protect yourself and your family',
    videos: [
      {
        id: 'ins-1',
        title: 'Why You Need Insurance',
        duration: '4 min',
        description: 'Understanding the role of insurance in financial planning.',
        takeaways: [
          'Insurance is protection, not investment',
          'Health insurance is non-negotiable',
          'Term insurance if anyone depends on your income',
        ],
      },
    ],
  },
  {
    id: 'investing',
    title: 'Investing Basics',
    emoji: '📈',
    color: '#f97316',
    description: 'Start your investing journey',
    videos: [
      {
        id: 'invest-1',
        title: 'Why Invest?',
        duration: '5 min',
        description: 'Why keeping all money in savings account isn\'t enough.',
        takeaways: [
          'Inflation eats your savings',
          'Investing helps money grow faster',
          'Start with SIPs in index funds',
        ],
      },
      {
        id: 'invest-2',
        title: 'Mutual Funds for Beginners',
        duration: '7 min',
        description: 'A simple guide to getting started with mutual funds.',
        takeaways: [
          'SIP means investing a fixed amount monthly',
          'Index funds are low-cost and diversified',
          'Start with ₹500/month SIP',
        ],
      },
    ],
  },
  {
    id: 'tax',
    title: 'Tax Saving',
    emoji: '🧾',
    color: '#06b6d4',
    description: 'Save more on taxes legally',
    videos: [
      {
        id: 'tax-1',
        title: 'Section 80C Explained',
        duration: '5 min',
        description: 'How to save up to ₹1.5 lakh in taxes.',
        takeaways: [
          'EPF, PPF, ELSS, LIC qualify under 80C',
          'Max deduction: ₹1.5 lakh per year',
          'ELSS has the shortest lock-in (3 years)',
        ],
      },
    ],
  },
];

export const getAllVideos = () => {
  return TOPICS.flatMap((topic) =>
    topic.videos.map((v) => ({ ...v, topicId: topic.id, topicTitle: topic.title }))
  );
};

export const getVideoById = (videoId) => {
  return getAllVideos().find((v) => v.id === videoId);
};

export const getTopicById = (topicId) => {
  return TOPICS.find((t) => t.id === topicId);
};

export const getRecommendedVideos = () => {
  return getAllVideos().slice(0, 3);
};
