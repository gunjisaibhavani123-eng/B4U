import { useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetGoalsQuery } from '../services/goalApi';
import { GOAL_ICONS } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { ROUTES } from '@shared/constants/routes';

export default function GoalsOverview() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetGoalsQuery();

  const goals = data?.goals || data || [];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold text-gray-900">Savings Goals</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.CREATE_GOAL)}
          className="rounded-lg"
        >
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="py-12">
          <Empty description="No goals yet. Start saving!" />
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {goals.map((goal) => {
            const pct = goal.target_amount > 0
              ? Math.round((goal.current_amount / goal.target_amount) * 100)
              : 0;
            return (
              <div
                key={goal.id}
                onClick={() => navigate(`/goals/${goal.id}`)}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{GOAL_ICONS[goal.icon]?.emoji || '🎯'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{goal.name}</p>
                    <p className="text-xs text-gray-400">
                      {goal.target_date ? `Target: ${goal.target_date}` : 'No deadline'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{pct}%</span>
                </div>
                <Progress percent={pct} strokeColor="#22c55e" showInfo={false} size="small" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{formatCurrency(goal.current_amount)}</span>
                  <span className="text-xs text-gray-500">{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
