import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined, BulbOutlined } from '@ant-design/icons';
import { ROUTES } from '@shared/constants/routes';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        block
        onClick={() => navigate(ROUTES.ADD_EXPENSE)}
        className="h-12 rounded-xl font-medium"
      >
        Log Expense
      </Button>
      <Button
        icon={<BulbOutlined />}
        size="large"
        block
        onClick={() => navigate(ROUTES.NUDGE)}
        className="h-12 rounded-xl font-medium border-green-500 text-green-600"
      >
        Nudge Check
      </Button>
    </div>
  );
}
