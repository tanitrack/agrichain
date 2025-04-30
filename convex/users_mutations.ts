import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    nationalIdNumber: v.string(),
    userType: v.union(v.literal('farmer'), v.literal('consumer')),
  },
  handler: async (ctx, args) => {
    // Find the current max taniId
    const users = await ctx.db.query('users').order('desc').take(1);
    const maxTaniId = users.length > 0 ? users[0].taniId : 0;
    const taniId = maxTaniId + 1;
    const now = Date.now();

    const id = await ctx.db.insert('users', {
      taniId,
      userId: args.userId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      address: args.address,
      nationalIdNumber: args.nationalIdNumber,
      userType: args.userType,
      createdAt: now,
      updatedAt: now,
    });

    return { id, taniId, ...args };
  },
});

export const updateUser = mutation({
  args: {
    convexId: v.id('users'),
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    nationalIdNumber: v.string(),
    userType: v.union(v.literal('farmer'), v.literal('consumer')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    console.log({ identity });

    const { convexId, ...metadata } = args;
    const now = Date.now();
    const existing = await ctx.db.get(convexId);

    if (!existing) {
      throw new Error('User not found');
    }
    await ctx.db.patch(convexId, {
      ...metadata,
      updatedAt: now,
    });

    return { convexId, existing, ...metadata };
  },
});
