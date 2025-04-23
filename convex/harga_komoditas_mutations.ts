/* eslint-disable @eslint-react/naming-convention/filename */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    name: v.string(),
    unit: v.string(),
    price: v.string(),
    grade: v.string(),
    prediction: v.string(),
    region: v.string(),
  },
  returns: v.id('harga_komoditas'),
  handler: async (ctx, args) => {

    const hargaKomoditasId = await ctx.db.insert('harga_komoditas', {
      ...args,
      updatedAt: Date.now(),
    });

    return hargaKomoditasId;
  },
});

export const update = mutation({
  args: {
    id: v.id('harga_komoditas'),
    name: v.optional(v.string()),
    unit: v.optional(v.string()),
    price: v.optional(v.string()),
    grade: v.optional(v.string()),
    prediction: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  returns: v.id('harga_komoditas'),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error('Harga Komoditas not found');
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
    id: v.id('harga_komoditas'),
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

   

    await ctx.db.delete(args.id);
    return true;
  },
});
