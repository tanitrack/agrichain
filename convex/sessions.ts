import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

// 2 hours session duration
const SESSION_DURATION = 2 * 60 * 60 * 1000;

export const createSession = internalMutation({
  args: {
    userId: v.string(),
    sessionToken: v.string(),
    provider: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('sessions', {
      ...args,
      lastVerified: now,
      createdAt: now,
      expiresAt: now + SESSION_DURATION,
    });
  },
});

export const validateSession = internalQuery({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_session_token', (q) => q.eq('sessionToken', sessionToken))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  },
});

export const refreshSession = internalMutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, { sessionId }) => {
    const now = Date.now();
    await ctx.db.patch(sessionId, {
      lastVerified: now,
      expiresAt: now + SESSION_DURATION,
    });
  },
});

export const deleteSession = internalMutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, { sessionId }) => {
    await ctx.db.delete(sessionId);
  },
});

// Cleanup expired sessions - should be called periodically
export const cleanupExpiredSessions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query('sessions')
      .withIndex('by_expiry')
      .filter((q) => q.lt(q.field('expiresAt'), now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }
  },
});
