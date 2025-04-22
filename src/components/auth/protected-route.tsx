import { Navigate, useLocation } from 'react-router-dom';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded} = useDynamicContext()

  if (!sdkHasLoaded) {
    return <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-earth-pale-green to-white md:flex-row">
      <Spinner size='xl'/>
    </div>
  }

  if (!isLoggedIn) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
