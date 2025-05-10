import { useAuthFromDynamic } from '@/hooks/use-auth-from-dynamic';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import { clientEnv } from '@/lib/client-env-variables';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

interface ConvexDynamicProviderProps {
  children: ReactNode;
}

const convex = new ConvexReactClient(clientEnv.VITE_CONVEX_URL, {
  verbose: true,
});

export function ConvexDynamicProvider({ children }: ConvexDynamicProviderProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: clientEnv.VITE_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromDynamic}>
        {children}
      </ConvexProviderWithAuth>
    </DynamicContextProvider>
  );
}
