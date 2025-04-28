import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Clean up expired sessions every hour
crons.interval(
  'cleanup-expired-sessions',
  { hours: 1 },
  internal.sessions.cleanupExpiredSessions,
  {}
);

export default crons;
