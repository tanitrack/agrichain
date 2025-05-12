import { paginationOptsValidator } from 'convex/server';
import { query } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { id: v.id('transaction') },
  returns: v.union(
    v.object({
      _id: v.id('transaction'),
      _creationTime: v.number(),
      orderBookId: v.id('orderBook'),
      buyerSolanaPublicKey: v.string(),
      sellerSolanaPublicKey: v.string(),
      amountLamports: v.number(),
      escrowPdaAddress: v.optional(v.string()),
      onChainEscrowStatus: v.optional(v.string()),
      initializeTxHash: v.optional(v.string()),
      confirmOrderTxHash: v.optional(v.string()),
      withdrawFundsTxHash: v.optional(v.string()),
      refundOrderTxHash: v.optional(v.string()),
      failOrderTxHash: v.optional(v.string()),
      closeEscrowTxHash: v.optional(v.string()),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.id);
    return transaction;
  },
});

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    orderBookId: v.optional(v.id('orderBook')),
    escrowPdaAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let baseQuery;
    const { orderBookId, escrowPdaAddress } = args;

    if (orderBookId !== undefined) {
      baseQuery = ctx.db
        .query('transaction')
        .withIndex('by_orderBookId', (q) => q.eq('orderBookId', orderBookId));
    } else if (escrowPdaAddress !== undefined) {
      baseQuery = ctx.db
        .query('transaction')
        .withIndex('by_escrowPdaAddress', (q) => q.eq('escrowPdaAddress', escrowPdaAddress));
    } else {
      baseQuery = ctx.db.query('transaction');
    }

    const orderedQuery = baseQuery.order('desc');

    if (args.paginationOpts) {
      return await orderedQuery.paginate(args.paginationOpts);
    }

    const results = await orderedQuery.collect();
    return {
      page: results,
      isDone: true,
      continueCursor: null,
    };
  },
});
//       continueCursor: null,
//     };
//   },
// });

export const getEscrowDetailsForAction = query({
  args: { orderBookId: v.id('orderBook') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be logged in.');
    }

    const orderBook = await ctx.db.get(args.orderBookId);
    if (!orderBook) {
      throw new Error('OrderBook not found.');
    }

    if (!orderBook.financialTransactionId) {
      throw new Error('Transaction not linked to this OrderBook yet.');
    }

    const transaction = await ctx.db.get(orderBook.financialTransactionId);
    if (!transaction || !transaction.escrowPdaAddress) {
      throw new Error('Escrow details not found or escrow not initialized for this transaction.');
    }

    return {
      escrowPdaAddress: transaction.escrowPdaAddress,
      // You might also need buyer/seller Solana public keys from the transaction record
      // if the frontend doesn't already have them for constructing the on-chain call.
      buyerSolanaPublicKey: transaction.buyerSolanaPublicKey,
      sellerSolanaPublicKey: transaction.sellerSolanaPublicKey,
      onChainEscrowStatus: transaction.onChainEscrowStatus, // Useful for frontend logic
    };
  },
});
