import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';
import { useAuthFromDynamic } from '@/hooks/use-auth-from-dynamic';

interface ConvexDynamicProviderProps {
  children: ReactNode;
  convex: ConvexReactClient;
}

export function ConvexDynamicProvider({ children, convex }: ConvexDynamicProviderProps) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuthFromDynamic}>
      {children}
    </ConvexProviderWithAuth>
  );
}
