import { useNavigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSystemAuthenticated, isLoadingAuth, userProfile } = useAuthCheck();
  const { handleLogOut } = useDynamicContext();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await handleLogOut();
      navigate('/login');
    };

    if (!isSystemAuthenticated && !isLoadingAuth) {
      logout();
    }
  }, [isSystemAuthenticated, handleLogOut, navigate, isLoadingAuth]);

  if (isLoadingAuth && !userProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
        <span className="sr-only">loading</span>
      </div>
    );
  }

  return <>{children}</>;
};
