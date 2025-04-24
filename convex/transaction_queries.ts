/* eslint-disable @eslint-react/naming-convention/filename */
import { query } from './_generated/server';
import { v } from 'convex/values';


export const get = query({
  args: { id: v.id('transaction') },
  returns: v.union(
    v.object({
      _id: v.id('transaction'),
      _creationTime: v.number(),
      trxId: v.string(),
      customerName: v.string(),
      commodityName: v.optional(v.string()),
      status: v.string(),
      unit: v.string(),
      unitPrice: v.number(),
      totalUnit: v.number(),
      type: v.optional(v.string()),
      price: v.number(),
      description: v.optional(v.string()),
      createdBy: v.string(),
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
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null()),
      })
    ),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    
    const baseQuery = ctx.db.query('transaction');

    
    const filteredQuery =
      args.status !== undefined
        ? baseQuery.withIndex('by_status', (q) => q.eq('status', args.status as string))
        : baseQuery;

    const orderedQuery = filteredQuery.order('desc');

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

export const search = query({
  args: {
    query: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    
    const baseQuery = ctx.db.query('transaction');

    const searchedQuery = baseQuery.withSearchIndex('search', (q) => {
      let query = q.search('trxId', args.query);
      if (args.status !== undefined) {
        query = query.eq('status', args.status as string);
      }
      return query;
    });

    // Take only 10 results
    return await searchedQuery.take(10);
  },
});

export const listStatus = query({
  args: {},
  handler: async (ctx) => {
    const transaction = await ctx.db.query('transaction').collect();
    const status = new Set(transaction.map((k) => k.status));
    return Array.from(status).sort();
  },
});
