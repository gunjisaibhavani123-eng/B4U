import { Form, InputNumber, Button, message } from 'antd';
import { FIXED_EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { useUpdateFixedExpensesMutation } from '../services/onboardingApi';

const categories = Object.entries(FIXED_EXPENSE_CATEGORIES);

export default function FixedExpensesStep({ onNext }) {
  const [updateFixedExpenses, { isLoading }] = useUpdateFixedExpensesMutation();

  const onFinish = async (values) => {
    try {
      const expenses = categories
        .map(([key]) => ({
          category: key,
          amount: values[key] || 0,
        }))
        .filter((e) => e.amount > 0);

      const result = await updateFixedExpenses({ expenses }).unwrap();
      onNext(result);
    } catch (err) {
      message.error(err?.data?.detail || 'Failed to save expenses');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Your fixed monthly expenses</h2>
      <p className="text-gray-500 mb-6">These are expenses you pay every month</p>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        {categories.map(([key, { label, emoji }]) => (
          <Form.Item key={key} label={`${emoji} ${label}`} name={key}>
            <InputNumber
              prefix="\u20B9"
              placeholder="0"
              min={0}
              className="w-full"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/,/g, '')}
            />
          </Form.Item>
        ))}

        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Next →
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
