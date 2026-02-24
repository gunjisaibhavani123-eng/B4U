import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, selectOnboardingComplete } from '@features/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const onboardingComplete = useSelector(selectOnboardingComplete);

  return { user, isAuthenticated, onboardingComplete };
};
