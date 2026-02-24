import { useNavigate } from 'react-router-dom';
import { Spin, Progress } from 'antd';
import { RightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useGetChecklistQuery } from '../services/checklistApi';
import { CHECKLIST_ITEMS } from '@shared/constants/categories';

export default function ChecklistOverview() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetChecklistQuery();

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  const items = data?.items || data || [];
  const completed = items.filter((i) => i.completed).length;
  const total = items.length || 6;
  const pct = Math.round((completed / total) * 100);

  const mustHave = items.filter((i) => {
    const info = CHECKLIST_ITEMS[i.item_type];
    return info?.category === 'MUST HAVE';
  });
  const important = items.filter((i) => {
    const info = CHECKLIST_ITEMS[i.item_type];
    return info?.category === 'IMPORTANT';
  });

  const renderItem = (item) => {
    const info = CHECKLIST_ITEMS[item.item_type] || { label: item.item_type, emoji: '📋' };
    return (
      <div
        key={item.item_type}
        onClick={() => navigate(`/financial-health/${item.item_type}`)}
        className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 cursor-pointer active:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          {item.completed ? (
            <CheckCircleFilled style={{ fontSize: 24, color: '#22c55e' }} />
          ) : (
            <span className="text-xl">{info.emoji}</span>
          )}
          <span className={`text-sm font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {info.label}
          </span>
        </div>
        <RightOutlined className="text-gray-300" />
      </div>
    );
  };

  return (
    <div className="pb-4">
      <div className="px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold text-gray-900">Financial Health</h1>
      </div>

      {/* Score card */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <Progress
            type="circle"
            percent={pct}
            size={72}
            strokeColor="#22c55e"
            format={() => <span className="text-lg font-bold">{completed}/{total}</span>}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">Your Score</p>
            <p className="text-xs text-gray-500">
              {completed === total ? 'Great job! All done.' : `${total - completed} items remaining`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {mustHave.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-red-400 uppercase mb-2">Must Have</h2>
            <div className="space-y-2">{mustHave.map(renderItem)}</div>
          </div>
        )}
        {important.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-amber-400 uppercase mb-2">Important</h2>
            <div className="space-y-2">{important.map(renderItem)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
