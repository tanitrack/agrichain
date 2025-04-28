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

      const { token } = await fetch(
        `${import.meta.env.VITE_CONVEX_URL.replace('.cloud', '.site')}/auth/convert-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${dynamicJwtToken}`,
          },
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          console.error(e);
        });

      const { valid } = await fetch(
        `${import.meta.env.VITE_CONVEX_URL.replace('.cloud', '.site')}/auth/verify-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((r) => r.json())
        .catch((e) => {
          console.error(e);
        });

      if (token && valid) {
        return token;
      }

      return null;
    },
    [isLoggedIn, dynamicJwtToken]
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
