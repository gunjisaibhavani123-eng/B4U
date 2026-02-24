import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen pb-20 relative shadow-sm">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
