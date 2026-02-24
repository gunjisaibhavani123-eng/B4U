import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useGetChecklistItemQuery } from '../services/checklistApi';
import { CHECKLIST_CONTENT } from '../services/checklistContent';
import PageHeader from '@shared/components/PageHeader';
import MarkCompleteForm from './MarkCompleteForm';

export default function ChecklistItemDetail() {
  const { itemType } = useParams();
  const { data, isLoading } = useGetChecklistItemQuery(itemType);
  const content = CHECKLIST_CONTENT[itemType];

  if (isLoading) {
    return <div className="flex justify-center py-12"><Spin size="large" /></div>;
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Item" />
        <div className="p-4 text-center text-gray-500">Item not found</div>
      </div>
    );
  }

  const isCompleted = data?.completed;

  return (
    <div className="pb-4">
      <PageHeader title={content.title} />
      <div className="p-4 space-y-4">
        <div className="text-center py-2">
          <span className="text-5xl">{content.emoji}</span>
          {isCompleted && (
            <div className="mt-2 flex items-center justify-center gap-1 text-green-600">
              <CheckCircleFilled />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Why is this important?</h3>
          <p className="text-sm text-blue-700">{content.why}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">What to do</h3>
          <p className="text-sm text-gray-600">{content.what}</p>
        </div>

        {content.tips && (
          <div className="bg-amber-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-amber-800 mb-2">Tips</h3>
            <ul className="space-y-1">
              {content.tips.map((tip, i) => (
                <li key={i} className="text-sm text-amber-700 flex gap-2">
                  <span>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isCompleted && (
          <MarkCompleteForm
            itemType={itemType}
            fields={content.fields}
          />
        )}
      </div>
    </div>
  );
}
