import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

interface ConvexDynamicProviderProps {
  children: ReactNode;
  convex: ConvexReactClient;
}

export function ConvexDynamicProvider({ children, convex }: ConvexDynamicProviderProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
