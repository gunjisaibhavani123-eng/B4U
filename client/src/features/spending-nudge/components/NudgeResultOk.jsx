import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { useAddExpenseMutation } from '@features/expense-tracker/services/expenseApi';

export default function NudgeResultOk({ result, amount, category, description }) {
  const navigate = useNavigate();
  const [addExpense, { isLoading }] = useAddExpenseMutation();

  const handleLog = async () => {
    try {
      await addExpense({
        amount,
        category,
        description: description || undefined,
        date: new Date().toISOString().split('T')[0],
      }).unwrap();
      message.success('Expense logged!');
      navigate('/expenses');
    } catch {
      message.error('Failed to log expense');
    }
  };

  return (
    <div className="p-4 space-y-5 text-center">
      <div className="py-6">
        <CheckCircleOutlined style={{ fontSize: 64, color: '#22c55e' }} />
        <h2 className="text-xl font-bold text-gray-900 mt-4">You're Good!</h2>
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(amount)} fits within your budget
        </p>
      </div>

      {result?.budget_impact?.remaining_after != null && (
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-green-800">
            You'll still have <strong>{formatCurrency(result.budget_impact.remaining_after)}</strong> left in this category
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleLog}
          className="h-12 rounded-xl font-semibold"
        >
          Log This Expense
        </Button>
        <Button
          size="large"
          block
          onClick={() => navigate('/dashboard')}
          className="h-12 rounded-xl"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
