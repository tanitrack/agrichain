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

// export const list = query({
//   args: {
//     paginationOpts: v.optional(
//       v.object({
//         numItems: v.number(),
//         cursor: v.union(v.string(), v.null()),
//       })
//     ),
//     orderBookId: v.optional(v.id('orderBook')), // Filter by orderBookId
//     escrowPdaAddress: v.optional(v.string()), // Filter by escrowPdaAddress
//   },
//   handler: async (ctx, args) => {
//     let baseQuery = ctx.db.query('transaction');

//     // Apply filtering based on provided arguments
//     if (args.orderBookId !== undefined) {
//       baseQuery = baseQuery.withIndex('by_orderBookId', (q) =>
//         q.eq('orderBookId', args.orderBookId)
//       );
//     } else if (args.escrowPdaAddress !== undefined) {
//       baseQuery = baseQuery.withIndex('by_escrowPdaAddress', (q) =>
//         q.eq('escrowPdaAddress', args.escrowPdaAddress)
//       );
//     }
//     // Note: If both are provided, orderBookId filter will take precedence due to the if/else if structure.
//     // Adjust logic if you need to support filtering by both simultaneously or with different precedence.

//     const orderedQuery = baseQuery.order('desc'); // Keep ordering by creation time (default) descending

//     if (args.paginationOpts) {
//       return await orderedQuery.paginate(args.paginationOpts);
//     }

//     const results = await orderedQuery.collect();
//     return {
//       page: results,
//       isDone: true,
//       continueCursor: null,
//     };
//   },
// });
