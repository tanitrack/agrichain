import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    buyerSolanaPublicKey: v.string(),
    sellerSolanaPublicKey: v.string(),
    orderDetails: v.string(), // Will store orderBook._id
    amountLamports: v.number(),
    escrowPdaAddress: v.string(),
    initializeTxHash: v.string(),
  },
  returns: v.id('transaction'),
  handler: async (ctx, args) => {
    // No identity check here, as this mutation might be called by an action
    // after an on-chain event, not directly by an authenticated user.
    // Access control should be handled by Convex rules or by ensuring
    // only trusted actions call this mutation.

    const transactionId = await ctx.db.insert('transaction', {
      orderBookId: args.orderBookId,
      buyerSolanaPublicKey: args.buyerSolanaPublicKey,
      sellerSolanaPublicKey: args.sellerSolanaPublicKey,
      amountLamports: args.amountLamports,
      escrowPdaAddress: args.escrowPdaAddress,
      initializeTxHash: args.initializeTxHash,
      onChainEscrowStatus: 'initialized', // Initial status
      // _creationTime is added automatically by Convex
      updatedAt: Date.now(),
    });

    return transactionId;
  },
});

export const update = mutation({
  args: {
    id: v.id('transaction'),
    // Include fields that might be updated during the transaction flow
    escrowPdaAddress: v.optional(v.string()),
    onChainEscrowStatus: v.optional(v.string()),
    initializeTxHash: v.optional(v.string()),
    confirmOrderTxHash: v.optional(v.string()),
    withdrawFundsTxHash: v.optional(v.string()),
    refundOrderTxHash: v.optional(v.string()),
    failOrderTxHash: v.optional(v.string()),
    closeEscrowTxHash: v.optional(v.string()),
    // Add other updatable fields as needed
  },
  returns: v.union(v.object({ _id: v.id('transaction') }), v.null()),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) {
      // Or throw an error if the transaction must exist
      return null;
    }

    // Filter out undefined values from updates
    const validUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(validUpdates).length === 0) {
      // No valid fields to update
      return { _id: id };
    }

    await ctx.db.patch(id, {
      ...validUpdates,
      updatedAt: Date.now(),
    });

    return { _id: id };
  },
});

export const remove = mutation({
  args: {
    id: v.id('transaction'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    // Note: Access control for deletion should be implemented here
    // based on the new schema (e.g., checking buyer/seller public keys)
    // For now, removing the old 'createdBy' check.
    // A more robust solution might involve checking if the calling user
    // is the buyer or seller associated with the orderBookId linked to the transaction.

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      return false; // Transaction not found
    }

    // TODO: Implement proper access control for deleting transactions
    // Example (requires fetching orderBook and checking buyer/seller IDs):
    // const orderBook = await ctx.db.get(existing.orderBookId);
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity || (orderBook.buyerId !== identity.subject && orderBook.sellerId !== identity.subject)) {
    //   throw new Error('Unauthorized: You can only delete your own transactions');
    // }

    await ctx.db.delete(args.id);
    return true;
  },
});
