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

export const recordEscrowClosed = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    txHash: v.string(),
    onChainStatus: v.string(), // "closed"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || !orderBook.financialTransactionId) {
      throw new Error('Unauthorized or OrderBook/Transaction not found.');
    }
    // Optional: Authorization check for buyer (original rent payer)
    if (orderBook.buyerId !== identity.subject) {
      // throw new Error("Unauthorized: Only the buyer can record escrow closure for this order.");
    }

    // Verify that the transaction is in a state where it can be closed
    const transaction = await ctx.db.get(orderBook.financialTransactionId);
    if (
      !transaction ||
      !['completed', 'refunded', 'failed'].includes(transaction.onChainEscrowStatus!)
    ) {
      // throw new Error(`Escrow cannot be closed in its current on-chain state: ${transaction?.onChainEscrowStatus}`);
      // It's possible the frontend already checked this, but an extra backend check can be good.
      // Or, simply proceed to update, assuming the on-chain call would have failed if not in a correct state.
    }

    await ctx.db.patch(orderBook.financialTransactionId, {
      closeEscrowTxHash: args.txHash,
      onChainEscrowStatus: args.onChainStatus,
      updatedAt: Date.now(),
    });

    // No change to orderBook.status is typically needed here.

    return { success: true };
  },
});

export const recordOrderRefunded = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    txHash: v.string(),
    onChainStatus: v.string(), // "refunded"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || !orderBook.financialTransactionId) {
      throw new Error('Unauthorized or OrderBook/Transaction not found.');
    }
    // Optional: Authorization check for buyer (original rent payer)
    // if (orderBook.buyerId !== identity.subject) {
    //     throw new Error("Unauthorized: Only the buyer can record escrow closure for this order.");
    // }

    // Verify that the transaction is in a state where it can be refunded
    const transaction = await ctx.db.get(orderBook.financialTransactionId);
    if (!transaction || transaction.onChainEscrowStatus !== 'initialized') {
      // throw new Error(`Escrow cannot be refunded in its current on-chain state: ${transaction?.onChainEscrowStatus}`);
      // It's possible the frontend already checked this, but an extra backend check can be good.
      // Or, simply proceed to update, assuming the on-chain call would have failed if not in a correct state.
    }

    await ctx.db.patch(orderBook.financialTransactionId, {
      refundOrderTxHash: args.txHash,
      onChainEscrowStatus: args.onChainStatus, // "refunded"
      amountLamports: 0,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.orderBookId, {
      status: 'refunded', // Or a more specific status
      updatedAt: Date.now(),
    });

    // ... (notify seller)
    return { success: true };
  },
});

export const recordOrderFailed = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    txHash: v.string(),
    onChainStatus: v.string(), // "failed"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || !orderBook.financialTransactionId) {
      throw new Error('Unauthorized or OrderBook/Transaction not found.');
    }
    // Optional: Authorization check for authority (buyer or seller)
    // if (orderBook.buyerId !== identity.subject && orderBook.sellerId !== identity.subject) {
    //     throw new Error("Unauthorized: Only the buyer or seller can record order failure for this order.");
    // }

    // Verify that the transaction is in a state where it can be failed
    const transaction = await ctx.db.get(orderBook.financialTransactionId);
    if (!transaction || !['initialized', 'confirmed'].includes(transaction.onChainEscrowStatus!)) {
      // throw new Error(`Escrow cannot be failed in its current on-chain state: ${transaction?.onChainEscrowStatus}`);
      // It's possible the frontend already checked this, but an extra backend check can be good.
      // Or, simply proceed to update, assuming the on-chain call would have failed if not in a correct state.
    }

    await ctx.db.patch(orderBook.financialTransactionId, {
      failOrderTxHash: args.txHash,
      onChainEscrowStatus: args.onChainStatus, // "failed"
      amountLamports: 0,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.orderBookId, {
      status: 'failed', // Or a more specific status
      updatedAt: Date.now(),
    });

    // ... (notify other party)
    return { success: true };
  },
});
