import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useAuth } from '@shared/hooks/useAuth';
import { setUser } from '@features/auth/authSlice';
import { ROUTES } from '@shared/constants/routes';
import PageHeader from '@shared/components/PageHeader';
import BasicInfoStep from './BasicInfoStep';
import IncomeStep from './IncomeStep';
import FixedExpensesStep from './FixedExpensesStep';
import DependentsStep from './DependentsStep';

const steps = [
  { title: 'Basic Info' },
  { title: 'Income' },
  { title: 'Expenses' },
  { title: 'Family' },
];

export default function OnboardingLayout() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate(ROUTES.WELCOME, { replace: true });
    return null;
  }

  const handleNext = (userData) => {
    if (userData) dispatch(setUser(userData));
    setCurrent((prev) => prev + 1);
  };

  const handleComplete = (userData) => {
    if (userData) dispatch(setUser(userData));
    message.success('Setup complete! Welcome to B4USpend');
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const handleBack = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
    else navigate(ROUTES.WELCOME);
  };

  const renderStep = () => {
    switch (current) {
      case 0: return <BasicInfoStep onNext={handleNext} />;
      case 1: return <IncomeStep onNext={handleNext} />;
      case 2: return <FixedExpensesStep onNext={handleNext} />;
      case 3: return <DependentsStep onComplete={handleComplete} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      <PageHeader title={`Step ${current + 1}/4`} onBack={handleBack} />
      <div className="px-6 pt-4">
        <Steps current={current} items={steps} size="small" className="mb-6" />
        {renderStep()}
      </div>
    </div>
  );
}
