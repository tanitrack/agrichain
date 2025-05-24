import { query } from './_generated/server';
import { v } from 'convex/values';
// Assuming Id is needed here too

// Get a single orderBook by ID
export const get = query({
  args: { id: v.id('orderBook') },
  handler: async (ctx, args) => {
    // check user
    const auth = await ctx.auth.getUserIdentity();

    if (!auth) {
      throw new Error('Unauthorized: User must be logged in to view order books.');
    }

    const orderBook = await ctx.db.get(args.id);

    if (!orderBook) {
      return null; // Handle case where order book is not found
    }

    // Fetch related documents
    const [transaction, buyer, seller, komoditas] = await Promise.all([
      orderBook.financialTransactionId
        ? ctx.db.get(orderBook.financialTransactionId)
        : Promise.resolve(null),
      ctx.db.get(orderBook.buyerId),
      orderBook.sellerId ? ctx.db.get(orderBook.sellerId) : Promise.resolve(null),
      ctx.db.get(orderBook.komoditasId),
    ]);

    // Get onChainEscrowStatus from transaction
    const onChainEscrowStatus = transaction?.onChainEscrowStatus || null;

    return {
      ...orderBook,
      transaction,
      buyer,
      seller,
      komoditas,
      onChainEscrowStatus,
    };
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

    const orderBooksWithBuyer = await Promise.all(
      orderBooks.map(async (orderBook) => {
        // Fetch the buyer's user document
        const buyer = await ctx.db.get(orderBook.buyerId);

        // Join with transaction data to get onChainEscrowStatus
        let onChainEscrowStatus = null;
        if (orderBook.financialTransactionId) {
          const transaction = await ctx.db.get(orderBook.financialTransactionId);
          onChainEscrowStatus = transaction?.onChainEscrowStatus || null;
        }

        // Fetch the komoditas document
        const komoditas = await ctx.db.get(orderBook.komoditasId);

        return {
          ...orderBook,
          buyer, // Include the buyer information
          onChainEscrowStatus,
          komoditas, // Include the komoditas information
        };
      })
    );

    return orderBooksWithBuyer;
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
    const orderBooksWithSeller = await Promise.all(
      orderBooks.map(async (orderBook) => {
        // Fetch the seller's user document
        const seller = orderBook.sellerId ? await ctx.db.get(orderBook.sellerId) : null;

        // Join with transaction data to get onChainEscrowStatus
        let onChainEscrowStatus = null;
        if (orderBook.financialTransactionId) {
          const transaction = await ctx.db.get(orderBook.financialTransactionId);
          onChainEscrowStatus = transaction?.onChainEscrowStatus || null;
        }

        // Fetch the komoditas document
        const komoditas = await ctx.db.get(orderBook.komoditasId);

        return {
          ...orderBook,
          seller, // Include the seller information
          onChainEscrowStatus,
          komoditas, // Include the komoditas information
        };
      })
    );

    return orderBooksWithSeller;
  },
});
