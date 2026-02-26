import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Card, Button, Progress, Tag, Empty, Spin, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import PageHeader from '@shared/components/PageHeader';
import { CHALLENGE_TYPES, BADGE_TYPES } from '@shared/constants/categories';
import { ROUTES } from '@shared/constants/routes';
import {
  useGetAvailableChallengesQuery,
  useGetMyChallengesQuery,
  useJoinChallengeMutation,
} from '../services/challengeApi';

const statusColors = {
  ACTIVE: 'blue',
  COMPLETED: 'green',
  FAILED: 'red',
  ABANDONED: 'default',
};

function AvailableTab() {
  const { data, isLoading } = useGetAvailableChallengesQuery();
  const [joinChallenge, { isLoading: isJoining }] = useJoinChallengeMutation();

  const handleJoin = async (challengeId) => {
    try {
      await joinChallenge({ challenge_id: challengeId }).unwrap();
      message.success('Challenge joined!');
    } catch (err) {
      message.error(err?.data?.detail || 'Failed to join challenge');
    }
  };

  if (isLoading) return <Spin className="flex justify-center mt-8" />;

  if (!data?.items?.length) {
    return <Empty description="No challenges available" className="mt-8" />;
  }

  return (
    <div className="space-y-3">
      {data.items.map((c) => {
        const typeInfo = CHALLENGE_TYPES[c.challenge_type] || {};
        const badgeInfo = BADGE_TYPES[c.badge_type] || {};
        return (
          <Card key={c.id} size="small" className="rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{typeInfo.emoji}</span>
                  <h3 className="font-semibold text-base m-0">{c.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-2">{c.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Tag icon={<ClockCircleOutlined />}>{c.duration_days} days</Tag>
                  {c.target_amount && <Tag color="blue">₹{c.target_amount.toLocaleString()}</Tag>}
                  <Tag color="gold">{badgeInfo.emoji} {badgeInfo.label}</Tag>
                </div>
              </div>
            </div>
            <Button
              type="primary"
              className="mt-3 w-full"
              onClick={() => handleJoin(c.id)}
              loading={isJoining}
            >
              Join Challenge
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

function MyChallengesTab() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyChallengesQuery();

  if (isLoading) return <Spin className="flex justify-center mt-8" />;

  if (!data?.items?.length) {
    return <Empty description="You haven't joined any challenges yet" className="mt-8" />;
  }

  return (
    <div className="space-y-3">
      {data.items.map((uc) => {
        const typeInfo = CHALLENGE_TYPES[uc.challenge?.challenge_type] || {};
        return (
          <Card
            key={uc.id}
            size="small"
            className="rounded-xl shadow-sm cursor-pointer"
            onClick={() => navigate(ROUTES.CHALLENGE_DETAIL.replace(':userChallengeId', uc.id))}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{typeInfo.emoji}</span>
              <h3 className="font-semibold text-base m-0 flex-1">{uc.challenge?.title}</h3>
              <Tag color={statusColors[uc.status]}>{uc.status}</Tag>
            </div>
            <Progress
              percent={Math.round(uc.progress_percent)}
              size="small"
              status={uc.status === 'COMPLETED' ? 'success' : uc.status === 'FAILED' ? 'exception' : 'active'}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Current: ₹{uc.current_value?.toLocaleString()}</span>
              <span>Target: ₹{uc.target_value?.toLocaleString()}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function ChallengesHome() {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="pb-20">
      <PageHeader title="Challenges" />
      <div className="px-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'available', label: 'Available', children: <AvailableTab /> },
            { key: 'my', label: 'My Challenges', children: <MyChallengesTab /> },
          ]}
        />
      </div>
    </div>
  );
}
