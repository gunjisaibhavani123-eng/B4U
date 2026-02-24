import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useLazyGetMeQuery } from '../services/authApi';
import { setCredentials, setUser } from '../authSlice';
import PageHeader from '@shared/components/PageHeader';
import { ROUTES } from '@shared/constants/routes';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const onFinish = async (values) => {
    try {
      const result = await login({
        phone: values.phone,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(result));

      const user = await getMe().unwrap();
      dispatch(setUser(user));

      if (user.onboarding_complete) {
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.ONBOARDING, { replace: true });
      }
    } catch (err) {
      message.error(err?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      <PageHeader title="Login" onBack={() => navigate(ROUTES.WELCOME)} />
      <div className="px-6 pt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back!</h2>
        <p className="text-gray-500 mb-6">Login to continue</p>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="10-digit phone number" maxLength={10} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="text-green-500 font-medium border-none bg-transparent cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
