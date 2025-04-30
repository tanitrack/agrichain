import { defineTable } from 'convex/server';
import { v } from 'convex/values';

const sessions = defineTable({
  userId: v.string(),
  sessionToken: v.string(),
  provider: v.string(),
  lastVerified: v.number(),
  expiresAt: v.number(),
  createdAt: v.number(),
  email: v.optional(v.string()),
})
  .index('by_session_token', ['sessionToken'])
  .index('by_user', ['userId'])
  .index('by_expiry', ['expiresAt']);

export default sessions;
