import { query } from './_generated/server';
import { v } from 'convex/values';

// Get a single komoditas by ID
export const get = query({
  args: { commodityId: v.string() },

  handler: async (ctx, args) => {
    const komoditas = await ctx.db
      .query('komoditas_bulk')
      .withIndex('by_commodity_id', (q) => q.eq('commodityId', args.commodityId))
      .collect();
    return komoditas;
  },
});
