import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { EXPENSE_CATEGORIES } from '@shared/constants/categories';
import { useAddExpenseMutation } from '../services/expenseApi';
import PageHeader from '@shared/components/PageHeader';

export default function AddExpenseForm() {
  const navigate = useNavigate();
  const [addExpense, { isLoading }] = useAddExpenseMutation();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(dayjs());

  const handleSubmit = async () => {
    if (!amount || !category) {
      message.warning('Enter amount and select a category');
      return;
    }
    try {
      await addExpense({
        amount: Number(amount),
        category,
        description: description || undefined,
        date: date.format('YYYY-MM-DD'),
      }).unwrap();
      message.success('Expense added!');
      navigate(-1);
    } catch {
      message.error('Failed to add expense');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Add Expense" />
      <div className="p-4 space-y-5">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Amount</label>
          <Input
            prefix="₹"
            placeholder="0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl h-14"
            inputMode="numeric"
            size="large"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-2 block">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                  category === key
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-100'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-[10px] text-gray-600 leading-tight text-center">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Description (optional)</label>
          <Input
            placeholder="What was it for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Date</label>
          <DatePicker
            value={date}
            onChange={(d) => d && setDate(d)}
            className="w-full"
            disabledDate={(d) => d.isAfter(dayjs())}
          />
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleSubmit}
          className="h-12 rounded-xl font-semibold mt-4"
        >
          Add Expense
        </Button>
      </div>
    </div>
  );
}
