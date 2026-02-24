import { useState } from 'react';
import { Button, message, Radio, Space } from 'antd';
import { DEPENDENT_TYPES } from '@shared/constants/categories';
import {
  useUpdateDependentsMutation,
  useCompleteOnboardingMutation,
} from '../services/onboardingApi';

const dependentOptions = Object.entries(DEPENDENT_TYPES);

export default function DependentsStep({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [updateDependents, { isLoading: isUpdating }] = useUpdateDependentsMutation();
  const [completeOnboarding, { isLoading: isCompleting }] = useCompleteOnboardingMutation();

  const handleSubmit = async () => {
    if (!selected) {
      message.warning('Please select who depends on you');
      return;
    }
    try {
      await updateDependents({ dependent_type: selected }).unwrap();
      const result = await completeOnboarding().unwrap();
      onComplete(result);
    } catch (err) {
      message.error(err?.data?.detail || 'Failed to complete setup');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Who depends on you?</h2>
      <p className="text-gray-500 mb-6">
        This helps us suggest the right insurance coverage for you.
      </p>

      <Radio.Group
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full"
      >
        <Space direction="vertical" className="w-full" size="middle">
          {dependentOptions.map(([key, { label }]) => (
            <Radio
              key={key}
              value={key}
              className="w-full border border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors"
            >
              {label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <div className="mt-8">
        <Button
          type="primary"
          block
          size="large"
          onClick={handleSubmit}
          loading={isUpdating || isCompleting}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
