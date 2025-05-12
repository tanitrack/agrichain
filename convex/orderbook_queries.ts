import { query } from './_generated/server';
import { v } from 'convex/values';
// Assuming Id is needed here too

// Get a single orderBook by ID
export const get = query({
  args: { id: v.id('orderBook') },
  returns: v.union(
    v.object({
      _id: v.id('orderBook'),
      _creationTime: v.number(),
      buyerId: v.id('users'),
      sellerId: v.optional(v.id('users')),
      komoditasId: v.id('komoditas'),
      quantity: v.number(),
      agreedPricePerUnit: v.number(),
      totalAmount: v.number(),
      status: v.string(),
      buyerSolanaPublicKey: v.string(),
      sellerSolanaPublicKey: v.string(),
      financialTransactionId: v.optional(v.id('transaction')),
      shippingAddress: v.optional(v.string()),
      shippingNotes: v.optional(v.string()),
      termsAndConditions: v.optional(v.string()),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    // check user
    const auth = await ctx.auth.getUserIdentity();

    if (!auth) {
      throw new Error('Unauthorized: User must be logged in to view order books.');
    }

    const orderBook = await ctx.db.get(args.id);
    return orderBook;
  },
});

export const listBySeller = query({
  args: { sellerId: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be logged in to view their seller order books.');
    }

    const orderBooks = await ctx.db
      .query('orderBook')
      .withIndex('by_sellerId', (q) => q.eq('sellerId', args.sellerId))
      .collect();

    // Join with transaction data to get onChainEscrowStatus
    const orderBooksWithTxStatus = await Promise.all(
      orderBooks.map(async (orderBook) => {
        if (orderBook.financialTransactionId) {
          const transaction = await ctx.db.get(orderBook.financialTransactionId);
          return {
            ...orderBook,
            onChainEscrowStatus: transaction?.onChainEscrowStatus || null,
          };
        }
        return {
          ...orderBook,
          onChainEscrowStatus: null,
        };
      })
    );

    return orderBooksWithTxStatus;
  },
});

export const listByBuyer = query({
  args: { buyerId: v.id('users') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be logged in to view their buyer order books.');
    }

    const orderBooks = await ctx.db
      .query('orderBook')
      .withIndex('by_buyerId', (q) => q.eq('buyerId', args.buyerId))
      .collect();

    // Join with transaction data to get onChainEscrowStatus
    const orderBooksWithTxStatus = await Promise.all(
      orderBooks.map(async (orderBook) => {
        if (orderBook.financialTransactionId) {
          const transaction = await ctx.db.get(orderBook.financialTransactionId);
          return {
            ...orderBook,
            onChainEscrowStatus: transaction?.onChainEscrowStatus || null,
          };
        }
        return {
          ...orderBook,
          onChainEscrowStatus: null,
        };
      })
    );

    return orderBooksWithTxStatus;
  },
});
