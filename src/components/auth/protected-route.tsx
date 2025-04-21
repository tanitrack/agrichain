import { Navigate, useLocation } from 'react-router-dom';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
