// convex/transaction_mutations.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';
// Assuming Id is needed here too

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

export const recordSellerConfirmation = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    txHash: v.string(),
    onChainStatus: v.string(), // "confirmed"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const orderBook = await ctx.db.get(args.orderBookId);
    if (!orderBook || !orderBook.financialTransactionId) {
      throw new Error('OrderBook or linked transaction not found.');
    }

    await ctx.db.patch(orderBook.financialTransactionId, {
      confirmOrderTxHash: args.txHash,
      onChainEscrowStatus: args.onChainStatus,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.orderBookId, {
      status: 'seller_confirmed_awaiting_shipment',
      updatedAt: Date.now(),
    });

    // ... (notify buyer)
    return { success: true };
  },
});

export const recordFundsWithdrawn = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    txHash: v.string(),
    onChainStatus: v.string(), // "completed"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || !orderBook.financialTransactionId) {
      throw new Error('Unauthorized or OrderBook/Transaction not found.');
    }

    // Optional: Check if orderBook status is "goods_received"
    if (orderBook.status !== 'goods_received') {
      // throw new Error("Cannot withdraw funds until buyer confirms receipt.");
    }

    await ctx.db.patch(orderBook.financialTransactionId, {
      withdrawFundsTxHash: args.txHash,
      onChainEscrowStatus: args.onChainStatus,
      amountLamports: 0, // Escrow account should be empty of principal now
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.orderBookId, {
      status: 'completed',
      updatedAt: Date.now(),
    });

    // TODO: Notify buyer transaction is complete.

    return { success: true };
  },
});
