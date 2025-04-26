import { useAuthFromDynamic } from '@/hooks/use-auth-from-dynamic';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

interface ConvexDynamicProviderProps {
  children: ReactNode;
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  verbose: true,
});

export function ConvexDynamicProvider({ children }: ConvexDynamicProviderProps) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromDynamic}>
      {children}
    </ConvexProviderWithAuth>
  );
}
