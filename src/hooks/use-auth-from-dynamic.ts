import { getAuthToken, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useCallback, useMemo } from 'react';

export function useAuthFromDynamic() {
  const { sdkHasLoaded, handleLogOut } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const dynamicJwtToken = getAuthToken();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken?: boolean } = {}) => {
      if (!isLoggedIn) {
        return null;
      }

      // Get the JWT token from Dynamic
      const token = dynamicJwtToken;
      console.log('token', token);
      return token || null;
    },
    [dynamicJwtToken, isLoggedIn]
  );

  return useMemo(
    () => ({
      isLoading: !sdkHasLoaded,
      isAuthenticated: !!dynamicJwtToken,
      fetchAccessToken,
      onLogout: handleLogOut,
    }),
    [sdkHasLoaded, dynamicJwtToken, fetchAccessToken, handleLogOut]
  );
}
