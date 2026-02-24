import { Spin } from 'antd';
import { useGetCurrentBudgetQuery } from '../services/budgetApi';
import { formatCurrency } from '@shared/utils/formatCurrency';
import PageHeader from '@shared/components/PageHeader';

export default function BudgetSummary() {
  const { data, isLoading } = useGetCurrentBudgetQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  const budget = data || {};
  const categories = budget.categories || [];
  const totalAllocated = categories.reduce((s, c) => s + (c.allocated || 0), 0);
  const totalSpent = categories.reduce((s, c) => s + (c.spent || 0), 0);
  const savings = (budget.total_income || 0) - totalAllocated;

  const segments = categories
    .filter((c) => c.allocated > 0)
    .map((c) => ({
      label: c.category,
      amount: c.allocated,
      pct: totalAllocated > 0 ? Math.round((c.allocated / totalAllocated) * 100) : 0,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Budget Summary" />
      <div className="p-4 space-y-4">
        {/* Income breakdown */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Total Income</span>
            <span className="text-sm font-semibold">{formatCurrency(budget.total_income)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Allocated</span>
            <span className="text-sm font-semibold text-amber-500">{formatCurrency(totalAllocated)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Total Spent</span>
            <span className="text-sm font-semibold text-red-500">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
            <span className="text-sm font-semibold text-gray-900">Potential Savings</span>
            <span className="text-sm font-bold text-green-600">{formatCurrency(savings)}</span>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Allocation Breakdown</h3>
          {/* Stacked bar */}
          <div className="flex rounded-full overflow-hidden h-4 mb-4">
            {segments.map((seg, i) => {
              const colors = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#6366f1', '#f43f5e', '#a855f7', '#6b7280'];
              return (
                <div
                  key={seg.label}
                  style={{ width: `${seg.pct}%`, backgroundColor: colors[i % colors.length] }}
                />
              );
            })}
          </div>
          <div className="space-y-2">
            {segments.map((seg) => (
              <div key={seg.label} className="flex justify-between text-sm">
                <span className="text-gray-600">{seg.label}</span>
                <span className="text-gray-900 font-medium">{formatCurrency(seg.amount)} ({seg.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {savings > 0 && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-sm text-green-800">
              💡 You could save <strong>{formatCurrency(savings)}</strong> this month by sticking to your budget!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
