import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/constants/routes';

export default function HealthScoreCard({ score, total }) {
  const navigate = useNavigate();
  const color = score >= 5 ? '#22c55e' : score >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <div
      onClick={() => navigate(ROUTES.FINANCIAL_HEALTH)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {score}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Financial Health</p>
          <p className="text-xs text-gray-500">{score}/{total} checkpoints done</p>
        </div>
      </div>
      <RightOutlined className="text-gray-400" />
    </div>
  );
}
