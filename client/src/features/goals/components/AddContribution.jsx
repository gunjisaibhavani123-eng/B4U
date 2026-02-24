import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import { useGetGoalDetailQuery, useAddContributionMutation } from '../services/goalApi';
import { GOAL_ICONS } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import PageHeader from '@shared/components/PageHeader';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export default function AddContribution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: goal } = useGetGoalDetailQuery(id);
  const [addContribution, { isLoading }] = useAddContributionMutation();
  const [amount, setAmount] = useState('');

  const remaining = goal ? Math.max(0, goal.target_amount - goal.current_amount) : 0;
  const newTotal = goal ? goal.current_amount + (Number(amount) || 0) : 0;
  const newPct = goal?.target_amount > 0 ? Math.round((newTotal / goal.target_amount) * 100) : 0;

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      message.warning('Enter an amount');
      return;
    }
    try {
      await addContribution({ goalId: id, amount: Number(amount) }).unwrap();
      message.success('Contribution added!');
      navigate(-1);
    } catch {
      message.error('Failed to add contribution');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Add Money" />
      <div className="p-4 space-y-5">
        {goal && (
          <div className="text-center">
            <span className="text-3xl">{GOAL_ICONS[goal.icon]?.emoji || '🎯'}</span>
            <p className="text-sm font-semibold mt-1">{goal.name}</p>
            <p className="text-xs text-gray-400">
              {formatCurrency(remaining)} remaining
            </p>
          </div>
        )}

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Amount</label>
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

        <div className="flex gap-2">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                Number(amount) === q
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              ₹{q >= 1000 ? `${q / 1000}K` : q}
            </button>
          ))}
        </div>

        {Number(amount) > 0 && (
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-sm text-green-800">
              Progress will be <strong>{Math.min(newPct, 100)}%</strong> after this
            </p>
          </div>
        )}

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleSubmit}
          className="h-12 rounded-xl font-semibold"
        >
          Add {amount ? formatCurrency(Number(amount)) : 'Money'}
        </Button>
      </div>
    </div>
  );
}
