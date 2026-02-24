import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { TOPICS, getRecommendedVideos } from '../services/educationContent';

export default function LearnHome() {
  const navigate = useNavigate();
  const recommended = getRecommendedVideos();

  return (
    <div className="pb-4">
      <div className="px-4 pt-3 pb-3">
        <h1 className="text-lg font-bold text-gray-900">Learn</h1>
        <p className="text-sm text-gray-500">Financial literacy made simple</p>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Recommended</h2>
          <div className="space-y-2">
            {recommended.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/learn/video/${video.id}`)}
                className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg">
                    ▶️
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{video.title}</p>
                    <p className="text-xs text-gray-400">{video.duration} • {video.topicTitle}</p>
                  </div>
                </div>
                <RightOutlined className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics grid */}
      <div className="px-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Topics</h2>
        <div className="grid grid-cols-2 gap-3">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/learn/topic/${topic.id}`)}
              className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer active:bg-gray-50"
            >
              <span className="text-2xl">{topic.emoji}</span>
              <p className="text-sm font-semibold text-gray-900 mt-2">{topic.title}</p>
              <p className="text-xs text-gray-400 mt-1">{topic.videos.length} videos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
