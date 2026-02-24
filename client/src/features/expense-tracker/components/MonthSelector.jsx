import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function MonthSelector({ label, onPrev, onNext, disableNext }) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer"
      >
        <LeftOutlined style={{ fontSize: 12 }} />
      </button>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <button
        onClick={onNext}
        disabled={disableNext}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border-none cursor-pointer disabled:opacity-30"
      >
        <RightOutlined style={{ fontSize: 12 }} />
      </button>
    </div>
  );
}
