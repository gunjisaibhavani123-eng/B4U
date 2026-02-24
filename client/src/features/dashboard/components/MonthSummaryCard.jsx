import { Progress } from 'antd';
import { formatCurrency } from '@shared/utils/formatCurrency';

export default function MonthSummaryCard({ totalIncome, totalSpent, remaining, spendPercent }) {
  const progressColor = spendPercent > 90 ? '#ef4444' : spendPercent > 70 ? '#f59e0b' : '#22c55e';

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">This Month</span>
        <span className="text-xs text-gray-400">{Math.round(spendPercent)}% spent</span>
      </div>

      <Progress
        percent={Math.min(spendPercent, 100)}
        strokeColor={progressColor}
        trailColor="#f3f4f6"
        showInfo={false}
        size="small"
      />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div>
          <p className="text-xs text-gray-500">Income</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalIncome)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-sm font-semibold text-red-500">{formatCurrency(totalSpent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-sm font-semibold text-green-600">{formatCurrency(remaining)}</p>
        </div>
      </div>
    </div>
  );
}
