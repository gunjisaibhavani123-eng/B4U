import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Empty, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetLeaderboardQuery } from '../services/challengeApi';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetLeaderboardQuery({ challengeId, limit: 50 });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
        <h2 className="m-0 text-lg font-semibold flex-1">
          {data?.challenge_title || 'Leaderboard'}
        </h2>
        <span className="text-sm text-gray-400">{data?.total_participants} participants</span>
      </div>

      <div className="px-4 mt-4">
        {!data?.entries?.length ? (
          <Empty description="No participants yet" />
        ) : (
          <Card className="rounded-xl">
            {data.entries.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between py-3 ${
                  entry.rank < data.entries.length ? 'border-b border-gray-50' : ''
                } ${entry.is_current_user ? 'bg-blue-50 rounded-lg px-3 -mx-1 font-semibold' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">
                    {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <span className="text-sm">
                    {entry.anonymous_name}
                    {entry.is_current_user && (
                      <span className="text-blue-500 ml-1">(You)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, entry.progress_percent)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {entry.progress_percent}%
                  </span>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
