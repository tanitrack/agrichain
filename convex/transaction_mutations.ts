// convex/transaction_mutations.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const recordEscrowInitializationAndLink = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    initializeTxHash: v.string(),
    escrowPdaAddress: v.string(),
    onChainStatus: v.string(),
    buyerSolanaPublicKey: v.string(),
    sellerSolanaPublicKey: v.string(),
    amountLamports: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be logged in.');
    }

    // 1. Fetch and validate the OrderBook
    const orderBook = await ctx.db.get(args.orderBookId);
    if (!orderBook) {
      throw new Error('OrderBook not found.');
    }

    // Optional: Check if the caller is the buyer for this orderBook
    // This check might be too strict if a system process calls this,
    // but good if only the buyer's frontend action triggers it.
    // if (orderBook.buyerId !== identity.subject) { // Assuming identity.subject is Convex user _id
    //     throw new Error("Unauthorized: Only the buyer can record escrow initialization for their order.");
    // }

    // Ensure the order book is in the expected state and not already linked
    if (orderBook.status !== 'awaiting_escrow_payment' || orderBook.financialTransactionId) {
      throw new Error('Invalid order state for recording escrow initialization.');
    }

    // 2. Create the Transaction record
    const now = Date.now();
    const newTransactionId = await ctx.db.insert('transaction', {
      orderBookId: args.orderBookId,
      buyerSolanaPublicKey: args.buyerSolanaPublicKey,
      sellerSolanaPublicKey: args.sellerSolanaPublicKey,
      amountLamports: args.amountLamports,
      escrowPdaAddress: args.escrowPdaAddress,
      onChainEscrowStatus: args.onChainStatus, // "initialized"
      initializeTxHash: args.initializeTxHash,
      updatedAt: now,
    });

    // 3. Update the OrderBook record to link the transaction and update status
    await ctx.db.patch(args.orderBookId, {
      financialTransactionId: newTransactionId,
      status: 'escrow_funded', // Or "awaiting_seller_confirmation"
      updatedAt: now,
    });

    // 4. (Optional) Notify the seller
    // Example: await ctx.scheduler.runAfter(0, internal.notifications.createSellerNotification, {
    //   orderBookId: args.orderBookId,
    //   message: `Order ${args.orderBookId} has been funded and awaits your confirmation.`,
    //   sellerId: orderBook.sellerId
    // });

    return { success: true, transactionId: newTransactionId.toString() };
  },
});

// Potentially add other transaction mutations here later
