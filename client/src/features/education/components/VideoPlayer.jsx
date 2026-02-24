import { useParams } from 'react-router-dom';
import { getVideoById } from '../services/educationContent';
import PageHeader from '@shared/components/PageHeader';

export default function VideoPlayer() {
  const { videoId } = useParams();
  const video = getVideoById(videoId);

  if (!video) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader title="Video" />
        <div className="p-4 text-center text-gray-500">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title={video.title} />

      {/* Placeholder player */}
      <div className="bg-gray-900 aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <span className="text-5xl">▶️</span>
          <p className="text-sm mt-2 opacity-60">Video coming soon</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{video.title}</h2>
          <p className="text-xs text-gray-400 mt-1">{video.duration} • {video.topicTitle}</p>
        </div>

        <p className="text-sm text-gray-600">{video.description}</p>

        {video.takeaways && video.takeaways.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Key Takeaways</h3>
            <ul className="space-y-2">
              {video.takeaways.map((t, i) => (
                <li key={i} className="text-sm text-green-700 flex gap-2">
                  <span>✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
