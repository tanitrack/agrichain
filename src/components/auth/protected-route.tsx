import { useNavigate } from 'react-router-dom';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = useIsLoggedIn();
  const { sdkHasLoaded, handleLogOut } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await handleLogOut();
      navigate('/login');
    };
    if (!isLoggedIn && sdkHasLoaded) {
      logout();
    }
  }, [isLoggedIn, handleLogOut, navigate, sdkHasLoaded]);

  if (!sdkHasLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
        <span className="sr-only">loading</span>
      </div>
    );
  }

  return <>{children}</>;
};
