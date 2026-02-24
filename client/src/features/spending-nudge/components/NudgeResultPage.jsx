import { useLocation, Navigate } from 'react-router-dom';
import PageHeader from '@shared/components/PageHeader';
import NudgeResultOk from './NudgeResultOk';
import NudgeResultWarning from './NudgeResultWarning';
import NudgeResultExceeds from './NudgeResultExceeds';

export default function NudgeResultPage() {
  const { state } = useLocation();

  if (!state?.result) {
    return <Navigate to="/nudge" replace />;
  }

  const { result, amount, category, description } = state;
  const status = (result.status || 'ok').toLowerCase();
  const props = { result, amount, category, description };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="Nudge Result" />
      {status === 'ok' && <NudgeResultOk {...props} />}
      {status === 'warning' && <NudgeResultWarning {...props} />}
      {status === 'exceeds' && <NudgeResultExceeds {...props} />}
    </div>
  );
}
