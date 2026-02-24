import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, message } from 'antd';
import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { useCheckNudgeMutation } from '../services/nudgeApi';
import PageHeader from '@shared/components/PageHeader';

const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => ({
  value: key,
  label: `${cat.emoji} ${cat.label}`,
}));

export default function NudgeEntryForm() {
  const navigate = useNavigate();
  const [checkNudge, { isLoading }] = useCheckNudgeMutation();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');

  const handleCheck = async () => {
    if (!amount || !category) {
      message.warning('Enter amount and select category');
      return;
    }
    try {
      const result = await checkNudge({
        amount: Number(amount),
        category,
        description: description || undefined,
      }).unwrap();
      navigate('/nudge/result', {
        state: { result, amount: Number(amount), category, description },
      });
    } catch {
      message.error('Failed to check. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Spending Nudge" />
      <div className="p-4 space-y-5">
        <div className="text-center py-2">
          <span className="text-4xl">🤔</span>
          <p className="text-sm text-gray-500 mt-2">Should I spend this?</p>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">How much?</label>
          <Input
            prefix="₹"
            placeholder="0"
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl h-14"
            size="large"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Category</label>
          <Select
            placeholder="Select category"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            className="w-full"
            size="large"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">What is it? (optional)</label>
          <Input
            placeholder="e.g., New headphones"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleCheck}
          className="h-12 rounded-xl font-semibold mt-4"
        >
          Check Before Spending
        </Button>
      </div>
    </div>
  );
}
