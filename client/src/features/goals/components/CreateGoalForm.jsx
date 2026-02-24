import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { GOAL_ICONS } from '@shared/constants/categories';
import { useCreateGoalMutation } from '../services/goalApi';
import PageHeader from '@shared/components/PageHeader';

export default function CreateGoalForm() {
  const navigate = useNavigate();
  const [createGoal, { isLoading }] = useCreateGoalMutation();
  const [iconKey, setIconKey] = useState('');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(null);
  const [initialAmount, setInitialAmount] = useState('');

  const handleSubmit = async () => {
    if (!name || !targetAmount) {
      message.warning('Enter goal name and target amount');
      return;
    }
    try {
      await createGoal({
        name,
        icon: iconKey || 'OTHER_GOAL',
        target_amount: Number(targetAmount),
        target_date: targetDate ? targetDate.format('YYYY-MM-DD') : undefined,
        initial_amount: Number(initialAmount) || 0,
      }).unwrap();
      message.success('Goal created!');
      navigate(-1);
    } catch {
      message.error('Failed to create goal');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Create Goal" />
      <div className="p-4 space-y-5">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">Choose an icon</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(GOAL_ICONS).map(([key, g]) => (
              <button
                key={key}
                onClick={() => { setIconKey(key); if (!name) setName(g.label); }}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer bg-white ${
                  iconKey === key ? 'border-green-500 bg-green-50' : 'border-gray-100'
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-xs text-gray-600">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Goal Name</label>
          <Input
            placeholder="e.g., New Bike"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Target Amount</label>
          <Input
            prefix="₹"
            placeholder="0"
            type="number"
            inputMode="numeric"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Target Date (optional)</label>
          <DatePicker
            value={targetDate}
            onChange={setTargetDate}
            className="w-full"
            disabledDate={(d) => d.isBefore(dayjs())}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Already Saved (optional)</label>
          <Input
            prefix="₹"
            placeholder="0"
            type="number"
            inputMode="numeric"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleSubmit}
          className="h-12 rounded-xl font-semibold mt-2"
        >
          Create Goal
        </Button>
      </div>
    </div>
  );
}
