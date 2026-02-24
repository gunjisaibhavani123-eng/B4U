import { Spin, Empty, Progress } from 'antd';
import { useCurrentMonth } from '@shared/hooks/useCurrentMonth';
import { useGetExpenseBreakdownQuery } from '../services/expenseApi';
import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import PageHeader from '@shared/components/PageHeader';
import MonthSelector from './MonthSelector';

export default function CategoryBreakdown() {
  const { month, year, label, goNext, goPrev, isCurrentMonth } = useCurrentMonth();
  const { data, isLoading } = useGetExpenseBreakdownQuery({ month, year });

  const rawCategories = data?.categories || data?.breakdown || data?.by_category || [];
  const categories = rawCategories.map((c) => ({
    ...c,
    amount: c.amount ?? c.total ?? 0,
  }));
  const total = data?.total_spent || data?.total || categories.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="pb-4">
      <PageHeader title="Spending Breakdown" />
      <MonthSelector
        label={label}
        onPrev={goPrev}
        onNext={goNext}
        disableNext={isCurrentMonth}
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Spin /></div>
      ) : categories.length === 0 ? (
        <div className="py-12"><Empty description="No expenses to analyze" /></div>
      ) : (
        <div className="p-4 space-y-3">
          {/* Pie-like summary */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>

          {/* Category bars */}
          <div className="space-y-3">
            {categories.map((cat) => {
              const info = EXPENSE_CATEGORIES[cat.category] || EXPENSE_CATEGORIES.OTHER;
              const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
              return (
                <div key={cat.category} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{info.emoji}</span>
                      <span className="text-sm font-medium text-gray-900">{info.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{formatCurrency(cat.amount)}</span>
                      <span className="text-xs text-gray-400 ml-1">{pct}%</span>
                    </div>
                  </div>
                  <Progress
                    percent={pct}
                    strokeColor={info.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
