import { ConvexReactClient } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
export { api };
