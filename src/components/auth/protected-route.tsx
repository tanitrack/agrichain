import { useNavigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSystemAuthenticated, isLoadingAuth, userProfile } = useAuthCheck();
  const { handleLogOut } = useDynamicContext();
  const navigate = useNavigate();

  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const logout = async () => {
      await handleLogOut();
      navigate('/login');
    };

    if (!isSystemAuthenticated && !isLoadingAuth) {
      logout();
    }
  }, [isSystemAuthenticated, handleLogOut, navigate, isLoadingAuth]);

  // show reset button if loading is more that 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoadingAuth) {
        setShowReset(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoadingAuth]);

  if (isLoadingAuth && !userProfile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-8">
        <Spinner size="xl" />
        <span className="sr-only">loading</span>
        {showReset && (
          <>
            <Button onClick={handleLogOut}>Reset</Button>
            <span className="text-sm text-muted-foreground">
              If you are stuck, please click the reset button to login again.
            </span>
          </>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
