import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';

export default function ExpenseItem({ expense, onDelete }) {
  const cat = EXPENSE_CATEGORIES[expense.category] || EXPENSE_CATEGORIES.OTHER;

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: cat.color + '15' }}
        >
          {cat.emoji}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {expense.description || cat.label}
          </p>
          <p className="text-xs text-gray-400">{cat.label}</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {formatCurrency(expense.amount)}
      </span>
    </div>
  );
}
