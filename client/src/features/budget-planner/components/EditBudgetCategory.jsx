import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Slider, Button, message } from 'antd';
import { useGetCurrentBudgetQuery, useUpdateBudgetCategoriesMutation } from '../services/budgetApi';
import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import PageHeader from '@shared/components/PageHeader';

export default function EditBudgetCategory() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const categoryKey = params.get('category');
  const { data: budget } = useGetCurrentBudgetQuery();
  const [updateCategories, { isLoading }] = useUpdateBudgetCategoriesMutation();

  const cat = budget?.categories?.find((c) => c.category === categoryKey);
  const [amount, setAmount] = useState(cat?.allocated || 0);
  const info = EXPENSE_CATEGORIES[categoryKey] || { label: categoryKey, emoji: '📋' };
  const maxAmount = budget?.total_income || 100000;

  const handleSave = async () => {
    try {
      const categories = budget.categories.map((c) =>
        c.category === categoryKey ? { ...c, allocated: amount } : c
      );
      await updateCategories({ id: budget.id, categories }).unwrap();
      message.success('Budget updated!');
      navigate(-1);
    } catch {
      message.error('Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={`Edit ${info.label}`} />
      <div className="p-4 space-y-6">
        <div className="text-center">
          <span className="text-4xl">{info.emoji}</span>
          <p className="text-2xl font-bold mt-2">{formatCurrency(amount)}</p>
        </div>

        <Slider
          min={0}
          max={maxAmount}
          step={500}
          value={amount}
          onChange={setAmount}
          trackStyle={{ backgroundColor: '#22c55e' }}
          handleStyle={{ borderColor: '#22c55e' }}
        />

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleSave}
          className="h-12 rounded-xl"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
