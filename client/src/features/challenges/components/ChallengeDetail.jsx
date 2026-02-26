import { useParams, useNavigate } from 'react-router-dom';
import { Card, Progress, Button, Tag, Spin, Empty, message, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { CHALLENGE_TYPES, BADGE_TYPES } from '@shared/constants/categories';
import { ROUTES } from '@shared/constants/routes';
import {
  useGetUserChallengeDetailQuery,
  useGetLeaderboardQuery,
  useAbandonChallengeMutation,
} from '../services/challengeApi';

export default function ChallengeDetail() {
  const { userChallengeId } = useParams();
  const navigate = useNavigate();
  const { data: uc, isLoading } = useGetUserChallengeDetailQuery(userChallengeId);
  const { data: leaderboard } = useGetLeaderboardQuery(
    { challengeId: uc?.challenge_id, limit: 5 },
    { skip: !uc?.challenge_id }
  );
  const [abandon, { isLoading: isAbandoning }] = useAbandonChallengeMutation();

  const handleAbandon = () => {
    Modal.confirm({
      title: 'Abandon Challenge?',
      icon: <ExclamationCircleOutlined />,
      content: 'You will lose all progress. This cannot be undone.',
      okText: 'Abandon',
      okType: 'danger',
      onOk: async () => {
        try {
          await abandon(userChallengeId).unwrap();
          message.success('Challenge abandoned');
          navigate(ROUTES.CHALLENGES);
        } catch {
          message.error('Failed to abandon challenge');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!uc) return <Empty description="Challenge not found" />;

  const challenge = uc.challenge;
  const typeInfo = CHALLENGE_TYPES[challenge?.challenge_type] || {};
  const badgeInfo = BADGE_TYPES[challenge?.badge_type] || {};
  const daysLeft = Math.max(0, Math.ceil((new Date(uc.end_date) - new Date()) / 86400000));

  return (
    <div className="pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTES.CHALLENGES)}
        />
        <h2 className="m-0 text-lg font-semibold flex-1">{challenge?.title}</h2>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Progress Card */}
        <Card className="rounded-xl text-center">
          <div className="text-3xl mb-2">{typeInfo.emoji}</div>
          <Progress
            type="circle"
            percent={Math.round(uc.progress_percent)}
            size={140}
            status={uc.status === 'COMPLETED' ? 'success' : uc.status === 'FAILED' ? 'exception' : 'active'}
          />
          <div className="mt-3 text-sm text-gray-500">
            {challenge?.description}
          </div>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <Card size="small" className="rounded-xl text-center">
            <div className="text-xs text-gray-400">Current</div>
            <div className="font-bold text-lg">₹{uc.current_value?.toLocaleString()}</div>
          </Card>
          <Card size="small" className="rounded-xl text-center">
            <div className="text-xs text-gray-400">Target</div>
            <div className="font-bold text-lg">₹{uc.target_value?.toLocaleString()}</div>
          </Card>
          <Card size="small" className="rounded-xl text-center">
            <div className="text-xs text-gray-400">Days Left</div>
            <div className="font-bold text-lg">{daysLeft}</div>
          </Card>
        </div>

        {/* Status & Badge */}
        <Card size="small" className="rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Tag icon={<ClockCircleOutlined />}>
                {uc.status === 'COMPLETED' ? 'Completed' : `${daysLeft} days left`}
              </Tag>
              <Tag color={uc.status === 'COMPLETED' ? 'green' : uc.status === 'FAILED' ? 'red' : 'blue'}>
                {uc.status}
              </Tag>
            </div>
            {uc.status === 'COMPLETED' && (
              <Tag color="gold" className="text-base">
                {badgeInfo.emoji} {badgeInfo.label}
              </Tag>
            )}
          </div>
        </Card>

        {/* Leaderboard Preview */}
        {leaderboard && leaderboard.entries?.length > 0 && (
          <Card
            size="small"
            className="rounded-xl"
            title={<span><TrophyOutlined className="mr-2" />Leaderboard</span>}
            extra={
              <Button
                type="link"
                size="small"
                onClick={() =>
                  navigate(ROUTES.CHALLENGE_LEADERBOARD.replace(':challengeId', uc.challenge_id))
                }
              >
                View All
              </Button>
            }
          >
            {leaderboard.entries.map((entry) => (
              <div
                key={entry.rank}
                className={`flex justify-between items-center py-1.5 ${
                  entry.is_current_user ? 'bg-blue-50 rounded px-2 font-semibold' : ''
                }`}
              >
                <span>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}{' '}
                  {entry.anonymous_name}
                  {entry.is_current_user && ' (You)'}
                </span>
                <span>{entry.progress_percent}%</span>
              </div>
            ))}
          </Card>
        )}

        {/* Abandon Button */}
        {uc.status === 'ACTIVE' && (
          <Button danger block onClick={handleAbandon} loading={isAbandoning}>
            Abandon Challenge
          </Button>
        )}
      </div>
    </div>
  );
}
