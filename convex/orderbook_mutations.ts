
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    id: v.string(),
    commodityName: v.string(),
    unit: v.string(),
    totalUnit: v.number(),
    status: v.string(),
    sendDate: v.number(),
    expiredDate: v.number(),
    createdBy: v.string(),
  },
  returns: v.id('orderBook'),
  handler: async (ctx, args) => {

    const orderBookId = await ctx.db.insert('orderBook', {
      ...args,
      createdBy: 'anonymous',
      updatedAt: Date.now(),
    });

    return orderBookId;
  },
});

export const update = mutation({
  args: {
    id: v.id('orderBook'),
    commodityName: v.optional(v.string()),
    unit: v.optional(v.string()),
    totalUnit: v.optional(v.number()),
    status: v.optional(v.string()),
    sendDate: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  },
  returns: v.id('orderBook'),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;


    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error('orderBook not found');
    }


    const validUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(id, {
      ...validUpdates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('orderBook'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      return false;
    }

    if (existing.createdBy !== identity.subject) {
      throw new Error('Unauthorized: You can only delete your own orderBook');
    }

    await ctx.db.delete(args.id);
    return true;
  },
});
