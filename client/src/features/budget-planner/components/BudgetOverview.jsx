import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Progress, message } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { useGetCurrentBudgetQuery, useCreateBudgetMutation } from '../services/budgetApi';
import { useGetDashboardQuery } from '@features/dashboard/services/dashboardApi';
import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { ROUTES } from '@shared/constants/routes';

export default function BudgetOverview() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetCurrentBudgetQuery();
  const { data: dashboard } = useGetDashboardQuery();
  const [createBudget, { isLoading: creating }] = useCreateBudgetMutation();

  const handleCreateBudget = async () => {
    try {
      const now = new Date();
      await createBudget({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        total_income: dashboard?.total_income || 0,
      }).unwrap();
      message.success('Budget created!');
    } catch {
      message.error('Failed to create budget');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  // No budget yet
  if (error?.status === 404 || !data) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-lg font-bold text-gray-900">Budget Planner</h1>
        <div className="py-12 text-center">
          <Empty description="No budget for this month" />
          <Button
            type="primary"
            size="large"
            loading={creating}
            onClick={handleCreateBudget}
            className="mt-4 h-12 rounded-xl"
          >
            Create Monthly Budget
          </Button>
        </div>
      </div>
    );
  }

  const budget = data;
  const categories = budget.categories || [];
  const fixedCategories = categories.filter((c) => c.is_fixed);
  const flexibleCategories = categories.filter((c) => !c.is_fixed);

  const renderCategory = (cat) => {
    const info = EXPENSE_CATEGORIES[cat.category] || { label: cat.category, emoji: '📋', color: '#6b7280' };
    const pct = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
    const isOver = pct > 100;

    return (
      <div
        key={cat.category}
        className="bg-white rounded-xl p-3 border border-gray-100 cursor-pointer active:bg-gray-50"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span>{info.emoji}</span>
            <span className="text-sm font-medium text-gray-900">{info.label}</span>
          </div>
          <span className={`text-sm font-semibold ${isOver ? 'text-red-500' : 'text-gray-900'}`}>
            {formatCurrency(cat.spent)} / {formatCurrency(cat.allocated)}
          </span>
        </div>
        <Progress
          percent={Math.min(pct, 100)}
          strokeColor={isOver ? '#ef4444' : pct > 80 ? '#f59e0b' : '#22c55e'}
          showInfo={false}
          size="small"
        />
      </div>
    );
  };

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h1 className="text-lg font-bold text-gray-900">Budget</h1>
        <Button
          type="text"
          icon={<PieChartOutlined />}
          onClick={() => navigate(ROUTES.BUDGET_SUMMARY)}
          className="text-green-600"
        >
          Summary
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {fixedCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Fixed Expenses</h2>
            <div className="space-y-2">
              {fixedCategories.map(renderCategory)}
            </div>
          </div>
        )}

        {flexibleCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Flexible Spending</h2>
            <div className="space-y-2">
              {flexibleCategories.map(renderCategory)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
