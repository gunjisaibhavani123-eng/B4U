import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';

export default function PageHeader({ title, onBack, extra }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-8 h-8 border-none bg-transparent cursor-pointer text-gray-600"
      >
        <LeftOutlined style={{ fontSize: 18 }} />
      </button>
      <h1 className="text-base font-semibold text-gray-900 flex-1 text-center">{title}</h1>
      <div className="w-8 flex justify-end">{extra}</div>
    </div>
  );
}
