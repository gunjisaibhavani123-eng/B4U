import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useAddExpenseMutation } from '@features/expense-tracker/services/expenseApi';

export default function NudgeResultExceeds({ result, amount, category, description }) {
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
        <CloseCircleOutlined style={{ fontSize: 64, color: '#ef4444' }} />
        <h2 className="text-xl font-bold text-gray-900 mt-4">Over Budget!</h2>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(amount)} exceeds your remaining budget
        </p>
      </div>

      {result?.budget_impact?.remaining_after != null && result.budget_impact.remaining_after < 0 && (
        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-sm text-red-800">
            You'll be <strong>{formatCurrency(Math.abs(result.budget_impact.remaining_after))}</strong> over budget in this category
          </p>
        </div>
      )}

      {result?.message && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-700">💡 {result.message}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="primary"
          danger
          size="large"
          block
          onClick={() => navigate(-1)}
          className="h-12 rounded-xl font-semibold"
        >
          Don't Buy
        </Button>
        <Button
          type="text"
          size="large"
          block
          loading={isLoading}
          onClick={handleBuyAnyway}
          className="h-12 rounded-xl text-gray-400"
        >
          Buy Anyway & Log
        </Button>
      </div>
    </div>
  );
}
