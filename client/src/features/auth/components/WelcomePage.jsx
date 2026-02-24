import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ROUTES } from '@shared/constants/routes';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-white text-3xl font-bold">B4U</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Know Before You Spend</h1>
        <p className="text-gray-500 text-center mb-12">Your personal financial guide</p>
      </div>

      <div className="px-8 pb-12">
        <Button
          type="primary"
          block
          size="large"
          onClick={() => navigate(ROUTES.REGISTER)}
          className="mb-4"
        >
          Get Started
        </Button>
        <p className="text-center text-gray-500">
          Already a user?{' '}
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
