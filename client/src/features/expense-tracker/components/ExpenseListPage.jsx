import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty } from 'antd';
import { PlusOutlined, PieChartOutlined } from '@ant-design/icons';
import { useCurrentMonth } from '@shared/hooks/useCurrentMonth';
import { useGetExpensesQuery } from '../services/expenseApi';
import { formatDateShort } from '@shared/utils/formatDate';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { ROUTES } from '@shared/constants/routes';
import MonthSelector from './MonthSelector';
import ExpenseItem from './ExpenseItem';

export default function ExpenseListPage() {
  const navigate = useNavigate();
  const { month, year, label, goNext, goPrev, isCurrentMonth } = useCurrentMonth();
  const { data, isLoading } = useGetExpensesQuery({ month, year });

  const expenses = data?.expenses || data?.items || [];
  const total = data?.total_spent || expenses.reduce((s, e) => s + e.amount, 0);

  // Group by date
  const grouped = expenses.reduce((acc, exp) => {
    const dateKey = exp.date || exp.created_at?.split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <h1 className="text-lg font-bold text-gray-900">Expenses</h1>
        <Button
          type="text"
          icon={<PieChartOutlined />}
          onClick={() => navigate(ROUTES.EXPENSE_BREAKDOWN)}
          className="text-green-600"
        >
          Breakdown
        </Button>
      </div>

      <MonthSelector
        label={label}
        onPrev={goPrev}
        onNext={goNext}
        disableNext={isCurrentMonth}
      />

      {total > 0 && (
        <div className="px-4 pb-2">
          <span className="text-sm text-gray-500">Total: </span>
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(total)}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Spin /></div>
      ) : expenses.length === 0 ? (
        <div className="py-12">
          <Empty description="No expenses this month" />
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="px-4 py-1">
                <span className="text-xs font-medium text-gray-400 uppercase">
                  {formatDateShort(date)}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {grouped[date].map((exp) => (
                  <ExpenseItem key={exp.id} expense={exp} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-20 right-4 z-30" style={{ maxWidth: 'calc(448px - 2rem)', right: 'auto', left: '50%', transform: 'translateX(calc(50% + 7rem))' }}>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate(ROUTES.ADD_EXPENSE)}
          className="w-14 h-14 shadow-lg"
          style={{ width: 56, height: 56, fontSize: 24 }}
        />
      </div>
    </div>
  );
}
