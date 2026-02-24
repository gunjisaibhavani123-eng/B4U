import { Form, InputNumber, Button, message } from 'antd';
import { useAuth } from '@shared/hooks/useAuth';
import { useUpdateIncomeMutation } from '../services/onboardingApi';

export default function IncomeStep({ onNext }) {
  const { user } = useAuth();
  const [updateIncome, { isLoading }] = useUpdateIncomeMutation();

  const onFinish = async (values) => {
    try {
      const result = await updateIncome({
        monthly_salary: values.monthly_salary,
        other_income: values.other_income || 0,
      }).unwrap();
      onNext(result);
    } catch (err) {
      message.error(err?.data?.detail || 'Failed to save income');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about your income</h2>
      <p className="text-gray-500 mb-6">This helps us plan your budget</p>

      <Form
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{
          monthly_salary: user?.monthly_salary,
          other_income: user?.other_income || 0,
        }}
      >
        <Form.Item
          label="Monthly Take-Home Salary"
          name="monthly_salary"
          rules={[{ required: true, message: 'Please enter your salary' }]}
          extra="After all deductions"
        >
          <InputNumber
            prefix="\u20B9"
            placeholder="0"
            min={1}
            className="w-full"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Any other monthly income?"
          name="other_income"
          extra="Freelance, rent, etc."
        >
          <InputNumber
            prefix="\u20B9"
            placeholder="0"
            min={0}
            className="w-full"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            Your info is 100% private. We never share or sell data.
          </p>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Next →
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
