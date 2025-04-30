import { getAuthToken, useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useCallback, useMemo } from 'react';
import { clientEnv } from '@/lib/client-env-variables';

export function useAuthFromDynamic() {
  const { sdkHasLoaded, handleLogOut, user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const dynamicJwtToken = getAuthToken();

  console.log({
    isLoggedIn,
    dynamicJwtToken,
    user,
  });

  const fetchAccessToken = useCallback(async () => {
    if (!isLoggedIn) {
      return null;
    }

    const { token } = await fetch(
      `${clientEnv.VITE_CONVEX_URL.replace('.cloud', '.site')}/auth/convert-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${dynamicJwtToken}`,
        },
        body: JSON.stringify({
          dynamicUserProfile: user,
        }),
      }
    )
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
      });

    const { valid } = await fetch(
      `${clientEnv.VITE_CONVEX_URL.replace('.cloud', '.site')}/auth/verify-token`,
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
  }, [isLoggedIn, dynamicJwtToken, user]);

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
