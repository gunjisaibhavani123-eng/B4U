import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../services/authApi';
import { setCredentials } from '../authSlice';
import PageHeader from '@shared/components/PageHeader';
import { ROUTES } from '@shared/constants/routes';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values) => {
    try {
      const result = await register({
        name: values.name,
        phone: values.phone,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(result));
      navigate(ROUTES.ONBOARDING);
    } catch (err) {
      message.error(err?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      <PageHeader title="Create Account" onBack={() => navigate(ROUTES.WELCOME)} />
      <div className="px-6 pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Join B4USpend</h2>
        <p className="text-gray-500 mb-6">Start your financial journey</p>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Your Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit phone number' },
            ]}
          >
            <Input placeholder="10-digit phone number" maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Minimum 6 characters" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter password" />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-green-500 font-medium border-none bg-transparent cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
