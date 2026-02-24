import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetGoalDetailQuery } from '../services/goalApi';
import { GOAL_ICONS } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDateShort } from '@shared/utils/formatDate';
import PageHeader from '@shared/components/PageHeader';

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: goal, isLoading } = useGetGoalDetailQuery(id);

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  if (!goal) {
    return <div className="p-4 text-center text-gray-500">Goal not found</div>;
  }

  const pct = goal.target_amount > 0
    ? Math.round((goal.current_amount / goal.target_amount) * 100)
    : 0;

  const contributions = goal.contributions || [];

  return (
    <div className="pb-4">
      <PageHeader title={goal.name} />
      <div className="p-4 space-y-4">
        {/* Circular progress */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <Progress
              type="circle"
              percent={pct}
              strokeColor="#22c55e"
              size={160}
              format={() => (
                <div className="text-center">
                  <span className="text-3xl">{GOAL_ICONS[goal.icon]?.emoji || '🎯'}</span>
                  <p className="text-xl font-bold mt-1">{pct}%</p>
                </div>
              )}
            />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-3">
            {formatCurrency(goal.current_amount)} of {formatCurrency(goal.target_amount)}
          </p>
          {goal.target_date && (
            <p className="text-sm text-gray-400">Target: {goal.target_date}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Remaining</p>
            <p className="text-sm font-bold text-gray-900">
              {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Contributions</p>
            <p className="text-sm font-bold text-gray-900">{contributions.length}</p>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          icon={<PlusOutlined />}
          onClick={() => navigate(`/goals/${id}/add-money`)}
          className="h-12 rounded-xl font-semibold"
        >
          Add Money
        </Button>

        {/* Contribution history */}
        {contributions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">History</h3>
            <div className="space-y-2">
              {contributions.map((c, i) => (
                <div key={c.id || i} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-100">
                  <span className="text-sm text-gray-600">
                    {formatDateShort(c.date || c.created_at)}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    +{formatCurrency(c.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
