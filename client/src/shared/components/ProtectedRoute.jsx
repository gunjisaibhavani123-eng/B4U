import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { ROUTES } from '@shared/constants/routes';

export default function ProtectedRoute() {
  const { isAuthenticated, onboardingComplete } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  if (onboardingComplete === false) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return <Outlet />;
}
