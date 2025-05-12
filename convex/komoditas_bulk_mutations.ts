import { mutation } from './_generated/server';
import { v } from 'convex/values';

// BULK Price
export const create = mutation({
  args: {
    commodityId: v.string(),
    minQuantity: v.string(),
    price: v.number(),
  },
  returns: v.id('komoditas_bulk'),
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

    const komoditasBulkId = await ctx.db.insert('komoditas_bulk', {
      commodityId: args.commodityId,
      minQuantity: args.minQuantity,
      price: args.price,
      createdBy: convexUser._id, // Use the Convex User's _id
      sellerSolanaPublicKey: userSolanaPublicKey, // Store it
      updatedAt: Date.now(),
    });

    return komoditasBulkId;
  },
});
