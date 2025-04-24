/* eslint-disable @eslint-react/naming-convention/filename */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    trxId: v.string(),
    customerName: v.string(),
    commodityName: v.string(),
    unit: v.string(), 
    totalUnit: v.number(),
    status: v.string(), 
    type: v.string(),
    unitPrice: v.number(),
    price: v.number(),
    name: v.string(),
    description: v.optional(v.string()),
  },
  returns: v.id('transaction'),
  handler: async (ctx, args) => {

    const transactionId = await ctx.db.insert('transaction', {
      ...args,
      createdBy: 'anonymous',
      updatedAt: Date.now(),
    });

    return transactionId;
  },
});

export const update = mutation({
  args: {
    id: v.id('transaction'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    unit: v.optional(v.string()),
    pricePerUnit: v.optional(v.number()),
    stock: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id('transaction'),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

 
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error('transaction not found');
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
    id: v.id('transaction'),
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
      throw new Error('Unauthorized: You can only delete your own komoditas');
    }

    await ctx.db.delete(args.id);
    return true;
  },
});
