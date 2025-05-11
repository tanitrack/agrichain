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
    solanaPublicKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find the current max taniId
    const users = await ctx.db.query('users').order('desc').take(1);
    const maxTaniId = users.length > 0 ? users[0].taniId : 0;
    const taniId = maxTaniId + 1;
    const now = Date.now();

    // const userExists = await ctx.db
    //   .query('users')
    //   .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
    //   .unique();
    // if (userExists) {
    //   // Optionally update if user exists but somehow createUser is called
    //   // Or throw an error: throw new Error("User already exists");
    //   // For now, let's assume this is for genuinely new TaniTrack profiles
    // }

    const id = await ctx.db.insert('users', {
      taniId, // your existing logic
      userId: args.userId,
      email: args.email,
      name: args.name,
      phone: args.phone,
      address: args.address,
      nationalIdNumber: args.nationalIdNumber,
      solanaPublicKey: args.solanaPublicKey,
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
    solanaPublicKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const { convexId, ...metadata } = args;
    const now = Date.now();
    const existing = await ctx.db.get(convexId);

    if (!existing) {
      throw new Error('User not found');
    }

    const updatesToApply: Partial<typeof existing> = { ...metadata, updatedAt: now };

    await ctx.db.patch(convexId, updatesToApply);

    return { convexId, existing, ...updatesToApply };
  },
});
