import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { api } from '@/lib/convex';
import { useConvexAuth, useConvex, useQuery } from 'convex/react';

export const useAuthCheck = () => {
  const { user, sdkHasLoaded } = useDynamicContext();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const isLoggedIn = useIsLoggedIn();

  const convex = useConvex();

  const userProfile = useQuery(
    api.users_queries.get,
    user?.userId ? { userId: user.userId } : 'skip'
  );

  const isLoadingAuth = isLoading || !sdkHasLoaded;

  return {
    isSystemAuthenticated: isAuthenticated && isLoggedIn && !isLoadingAuth,
    isLoadingAuth,
    convex,
    userProfile,
  };
};
