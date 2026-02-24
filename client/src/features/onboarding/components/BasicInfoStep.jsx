import { Form, Input, InputNumber, Button, message } from 'antd';
import { useAuth } from '@shared/hooks/useAuth';
import { useUpdateUserMutation } from '../services/onboardingApi';

export default function BasicInfoStep({ onNext }) {
  const { user } = useAuth();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const onFinish = async (values) => {
    try {
      const result = await updateUser({
        name: values.name,
        age: values.age,
        city: values.city,
      }).unwrap();
      onNext(result);
    } catch (err) {
      message.error(err?.data?.detail || 'Failed to save info');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Let's know you</h2>
      <p className="text-gray-500 mb-6">Tell us a bit about yourself</p>

      <Form
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ name: user?.name, age: user?.age, city: user?.city }}
      >
        <Form.Item
          label="Your Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please enter your age' }]}
        >
          <InputNumber
            placeholder="Your age"
            min={18}
            max={100}
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter your city' }]}
        >
          <Input placeholder="Your city" />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
            Next →
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
