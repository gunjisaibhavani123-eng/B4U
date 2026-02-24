import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useAddExpenseMutation } from '@features/expense-tracker/services/expenseApi';

export default function NudgeResultWarning({ result, amount, category, description }) {
  const navigate = useNavigate();
  const [addExpense, { isLoading }] = useAddExpenseMutation();

  const handleBuyAnyway = async () => {
    try {
      await addExpense({
        amount,
        category,
        description: description || undefined,
        date: new Date().toISOString().split('T')[0],
      }).unwrap();
      message.success('Expense logged');
      navigate('/expenses');
    } catch {
      message.error('Failed to log expense');
    }
  };

  return (
    <div className="p-4 space-y-5 text-center">
      <div className="py-6">
        <WarningOutlined style={{ fontSize: 64, color: '#f59e0b' }} />
        <h2 className="text-xl font-bold text-gray-900 mt-4">Think Twice</h2>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(amount)} will use up most of your remaining budget
        </p>
      </div>

      {result?.budget_impact?.remaining_after != null && (
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            Only <strong>{formatCurrency(result.budget_impact.remaining_after)}</strong> left in this category after this purchase
          </p>
        </div>
      )}

      {result?.message && (
        <p className="text-sm text-gray-600">{result.message}</p>
      )}

      <div className="space-y-3">
        <Button
          size="large"
          block
          onClick={() => navigate(-1)}
          className="h-12 rounded-xl font-semibold border-amber-400 text-amber-600"
        >
          Reconsider
        </Button>
        <Button
          type="default"
          size="large"
          block
          loading={isLoading}
          onClick={handleBuyAnyway}
          className="h-12 rounded-xl"
        >
          Buy Anyway & Log
        </Button>
      </div>
    </div>
  );
}
