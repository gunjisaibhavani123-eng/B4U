import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined, HomeFilled,
  BarChartOutlined, PieChartFilled,
  AimOutlined, CrownFilled,
  TrophyOutlined, TrophyFilled,
  ReadOutlined, ReadFilled,
  MessageOutlined, MessageFilled,
  UserOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@shared/constants/routes';

const tabs = [
  { key: 'home', label: 'Home', path: ROUTES.DASHBOARD, icon: HomeOutlined, activeIcon: HomeFilled },
  { key: 'track', label: 'Track', path: ROUTES.EXPENSES, icon: BarChartOutlined, activeIcon: PieChartFilled },
  { key: 'goals', label: 'Goals', path: ROUTES.GOALS, icon: AimOutlined, activeIcon: CrownFilled },
  { key: 'challenges', label: 'Challenges', path: ROUTES.CHALLENGES, icon: TrophyOutlined, activeIcon: TrophyFilled },
  { key: 'learn', label: 'Learn', path: ROUTES.LEARN, icon: ReadOutlined, activeIcon: ReadFilled },
  { key: 'chat', label: 'Chat', path: ROUTES.CHAT, icon: MessageOutlined, activeIcon: MessageFilled },
  { key: 'profile', label: 'Profile', path: ROUTES.PROFILE, icon: UserOutlined, activeIcon: UserOutlined },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === ROUTES.DASHBOARD) return location.pathname === ROUTES.DASHBOARD;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = active ? tab.activeIcon : tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full border-none bg-transparent cursor-pointer transition-colors ${
                active ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              <Icon style={{ fontSize: 22 }} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
