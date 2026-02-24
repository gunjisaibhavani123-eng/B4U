import { useParams, useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { getTopicById } from '../services/educationContent';
import PageHeader from '@shared/components/PageHeader';

export default function TopicList() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(topicId);

  if (!topic) {
    return (
      <div>
        <PageHeader title="Topic" />
        <div className="p-4 text-center text-gray-500">Topic not found</div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader title={topic.title} />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{topic.emoji}</span>
          <div>
            <p className="text-sm text-gray-500">{topic.description}</p>
            <p className="text-xs text-gray-400">{topic.videos.length} videos</p>
          </div>
        </div>

        <div className="space-y-2">
          {topic.videos.map((video, i) => (
            <div
              key={video.id}
              onClick={() => navigate(`/learn/video/${video.id}`)}
              className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{video.title}</p>
                  <p className="text-xs text-gray-400">{video.duration}</p>
                </div>
              </div>
              <RightOutlined className="text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
