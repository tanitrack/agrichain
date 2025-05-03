import { query } from './_generated/server';
import { v } from 'convex/values';

export const getUserByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .unique();
  },
});

export const getUserByTanidId = query({
  args: { tanidId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_tani_id', (q) => q.eq('taniId', args.tanidId))
      .unique();
  },
});
