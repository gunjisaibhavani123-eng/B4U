import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Radio, Collapse, Button, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@shared/hooks/useAuth';
import { logout } from '@features/auth/authSlice';
import { ROUTES } from '@shared/constants/routes';
import { FIXED_EXPENSE_CATEGORIES, DEPENDENT_TYPES } from '@shared/constants/categories';
import {
  useUpdateUserMutation,
  useUpdateIncomeMutation,
  useUpdateFixedExpensesMutation,
  useUpdateDependentsMutation,
} from '@features/onboarding/services/onboardingApi';

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [basicForm] = Form.useForm();
  const [incomeForm] = Form.useForm();
  const [expenseForm] = Form.useForm();
  const [dependentForm] = Form.useForm();

  const [updateUser, { isLoading: savingBasic }] = useUpdateUserMutation();
  const [updateIncome, { isLoading: savingIncome }] = useUpdateIncomeMutation();
  const [updateFixedExpenses, { isLoading: savingExpenses }] = useUpdateFixedExpensesMutation();
  const [updateDependents, { isLoading: savingDependents }] = useUpdateDependentsMutation();

  const [activeKeys, setActiveKeys] = useState(['basic']);

  const expenseInitial = {};
  if (user?.fixed_expenses) {
    user.fixed_expenses.forEach((e) => {
      expenseInitial[e.category] = e.amount;
    });
  }

  const handleBasicSave = async () => {
    try {
      const values = await basicForm.validateFields();
      await updateUser(values).unwrap();
      message.success('Basic info updated');
    } catch (err) {
      if (err?.data?.message) message.error(err.data.message);
    }
  };

  const handleIncomeSave = async () => {
    try {
      const values = await incomeForm.validateFields();
      await updateIncome({
        monthly_salary: values.monthly_salary,
        other_income: values.other_income || 0,
      }).unwrap();
      message.success('Income updated');
    } catch (err) {
      if (err?.data?.message) message.error(err.data.message);
    }
  };

  const handleExpenseSave = async () => {
    try {
      const values = await expenseForm.validateFields();
      const expenses = Object.entries(values)
        .filter(([, amount]) => amount > 0)
        .map(([category, amount]) => ({ category, amount }));
      await updateFixedExpenses({ expenses }).unwrap();
      message.success('Fixed expenses updated');
    } catch (err) {
      if (err?.data?.message) message.error(err.data.message);
    }
  };

  const handleDependentSave = async () => {
    try {
      const values = await dependentForm.validateFields();
      await updateDependents(values).unwrap();
      message.success('Dependents updated');
    } catch (err) {
      if (err?.data?.message) message.error(err.data.message);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const items = [
    {
      key: 'basic',
      label: 'Basic Info',
      children: (
        <Form form={basicForm} layout="vertical" initialValues={{ name: user?.name, age: user?.age, city: user?.city }}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter your name' }]}>
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item name="age" label="Age" rules={[{ required: true, message: 'Enter your age' }]}>
            <InputNumber min={18} max={100} className="w-full" placeholder="Age" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: 'Enter your city' }]}>
            <Input placeholder="City" />
          </Form.Item>
          <Button type="primary" block onClick={handleBasicSave} loading={savingBasic}>
            Save
          </Button>
        </Form>
      ),
    },
    {
      key: 'income',
      label: 'Income',
      children: (
        <Form
          form={incomeForm}
          layout="vertical"
          initialValues={{ monthly_salary: user?.monthly_salary, other_income: user?.other_income }}
        >
          <Form.Item name="monthly_salary" label="Monthly Salary" rules={[{ required: true, message: 'Enter salary' }]}>
            <InputNumber min={0} className="w-full" prefix="₹" placeholder="Monthly salary" />
          </Form.Item>
          <Form.Item name="other_income" label="Other Income">
            <InputNumber min={0} className="w-full" prefix="₹" placeholder="Other income" />
          </Form.Item>
          <Button type="primary" block onClick={handleIncomeSave} loading={savingIncome}>
            Save
          </Button>
        </Form>
      ),
    },
    {
      key: 'expenses',
      label: 'Fixed Expenses',
      children: (
        <Form form={expenseForm} layout="vertical" initialValues={expenseInitial}>
          {Object.entries(FIXED_EXPENSE_CATEGORIES).map(([key, { label, emoji }]) => (
            <Form.Item key={key} name={key} label={`${emoji} ${label}`}>
              <InputNumber min={0} className="w-full" prefix="₹" placeholder="0" />
            </Form.Item>
          ))}
          <Button type="primary" block onClick={handleExpenseSave} loading={savingExpenses}>
            Save
          </Button>
        </Form>
      ),
    },
    {
      key: 'dependents',
      label: 'Dependents',
      children: (
        <Form form={dependentForm} layout="vertical" initialValues={{ dependent_type: user?.dependent_type }}>
          <Form.Item name="dependent_type" rules={[{ required: true, message: 'Select dependent type' }]}>
            <Radio.Group className="flex flex-col gap-3">
              {Object.entries(DEPENDENT_TYPES).map(([key, { label, description }]) => (
                <Radio key={key} value={key}>
                  <span className="font-medium">{label}</span>
                  <span className="text-gray-400 text-sm ml-2">{description}</span>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Button type="primary" block onClick={handleDependentSave} loading={savingDependents}>
            Save
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-gray-500 text-sm mb-4">Edit your personal details</p>

        <Collapse
          activeKey={activeKeys}
          onChange={setActiveKeys}
          items={items}
          expandIconPosition="end"
        />

        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="mt-6"
          size="large"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
