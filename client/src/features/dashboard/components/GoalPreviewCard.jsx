import { useNavigate } from 'react-router-dom';
import { Progress } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { GOAL_ICONS } from '@shared/constants/categories';
import { formatCurrency } from '@shared/utils/formatCurrency';

export default function GoalPreviewCard({ goal }) {
  const navigate = useNavigate();

  if (!goal) {
    return (
      <div
        onClick={() => navigate('/goals/create')}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
      >
        <div>
          <p className="text-sm font-semibold text-gray-900">No active goal</p>
          <p className="text-xs text-gray-500">Create a savings goal to get started</p>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>
    );
  }

  const percent = goal.target_amount > 0
    ? Math.round((goal.current_amount / goal.target_amount) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/goals/${goal.id}`)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer active:bg-gray-50"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{GOAL_ICONS[goal.icon]?.emoji || '🎯'}</span>
          <p className="text-sm font-semibold text-gray-900">{goal.name}</p>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>
      <Progress percent={percent} strokeColor="#22c55e" size="small" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{formatCurrency(goal.current_amount)} saved</span>
        <span className="text-xs text-gray-500">{formatCurrency(goal.target_amount)} goal</span>
      </div>
    </div>
  );
}
