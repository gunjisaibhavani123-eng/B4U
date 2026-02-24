import { Spin } from 'antd';
import { useGetDashboardQuery } from '../services/dashboardApi';
import MonthSummaryCard from './MonthSummaryCard';
import HealthScoreCard from './HealthScoreCard';
import GoalPreviewCard from './GoalPreviewCard';
import QuickActions from './QuickActions';

export default function DashboardPage() {
  const { data, isLoading, error } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load dashboard. Please try again.
      </div>
    );
  }

  const d = data || {};

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{d.greeting || 'Hello!'}</h1>
        <p className="text-sm text-gray-500">{d.month_label}</p>
      </div>

      <MonthSummaryCard
        totalIncome={d.total_income}
        totalSpent={d.total_spent}
        remaining={d.remaining}
        spendPercent={d.spend_percent || 0}
      />

      <QuickActions />

      <HealthScoreCard
        score={d.health_score || 0}
        total={d.health_total || 6}
      />

      <GoalPreviewCard goal={d.active_goal} />
    </div>
  );
}
