import { mutation } from './_generated/server';
import { v } from 'convex/values';
// Import Id type

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    unit: v.string(),
    pricePerUnit: v.number(),
    stock: v.number(),
    imageUrl: v.optional(v.string()),
    harvestDate: v.optional(v.string()),
    grade: v.optional(v.string()),
  },
  returns: v.id('komoditas'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be logged in to create a commodity.');
    }

    // Fetch the Convex user record to get their _id
    const convexUser = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', identity.subject)) // identity.subject is Dynamic User ID
      .unique();

    if (!convexUser) {
      throw new Error('Convex user profile not found. Please complete your profile.');
    }

    // Check if the provided sellerSolanaPublicKey matches the one stored for the user, if it exists
    // This is an optional sanity check if you want to enforce consistency.
    // For now, we'll trust the frontend to send the correct one from the active user.
    // if (convexUser.solanaPublicKey && convexUser.solanaPublicKey !== args.sellerSolanaPublicKey) {
    //   throw new Error("Provided Solana public key does not match the user's stored key.");
    // }

    const userSolanaPublicKey = convexUser.solanaPublicKey;

    if (!userSolanaPublicKey) {
      throw new Error('User does not have a Solana public key associated with their profile.');
    }

    const komoditasId = await ctx.db.insert('komoditas', {
      name: args.name,
      description: args.description,
      category: args.category,
      unit: args.unit,
      pricePerUnit: args.pricePerUnit,
      stock: args.stock,
      grade: args.grade ?? '',
      farmersName: convexUser?.name,
      address: convexUser?.address,
      harvestDate: args.harvestDate ?? new Date().toDateString(),
      imageUrl: args.imageUrl,
      createdBy: convexUser._id, // Use the Convex User's _id
      sellerSolanaPublicKey: userSolanaPublicKey, // Store it
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
    grade: v.optional(v.string()),
    harvestDate: v.optional(v.string()),
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

    await ctx.db.delete(args.id);
    return true;
  },
});
