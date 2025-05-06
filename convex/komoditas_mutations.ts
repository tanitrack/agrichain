 
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    unit: v.string(),
    pricePerUnit: v.number(),
    stock: v.number(),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id('komoditas'),
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }

    const komoditasId = await ctx.db.insert('komoditas', {
      ...args,
      createdBy: 'anonymous', // TODO: change to dynamic user id
      updatedAt: Date.now(),
    });

    return komoditasId;
  },
});

export const update = mutation({
  args: {
    id: v.id('komoditas'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    unit: v.optional(v.string()),
    pricePerUnit: v.optional(v.number()),
    stock: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id('komoditas'),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error('Unauthorized');
    // }

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error('Komoditas not found');
    }

    // Only allow updates by the creator
    // if (existing.createdBy !== identity.subject) {
    //   throw new Error('Unauthorized: You can only update your own komoditas');
    // }

    // Remove undefined values from updates
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
    id: v.id('komoditas'),
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

    // Only allow deletion by the creator
    if (existing.createdBy !== identity.subject) {
      throw new Error('Unauthorized: You can only delete your own komoditas');
    }

    await ctx.db.delete(args.id);
    return true;
  },
});
