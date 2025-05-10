import { query } from './_generated/server';
import { v } from 'convex/values';

// Get a single orderBook by ID
export const get = query({
  args: { id: v.id('orderBook') },
  returns: v.union(
    v.object({
      _id: v.id('orderBook'),
      _creationTime: v.number(),
      commodityName: v.string(),
      unit: v.optional(v.string()),
      totalUnit: v.number(),
      status: v.optional(v.string()),
      sendDate: v.optional(v.number()),
      createdBy: v.string(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const orderBook = await ctx.db.get(args.id);
    return orderBook;
  },
});

// List all orderBook with optional pagination
export const list = query({
  args: {
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null()),
      })
    ),
    commodityName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // check user
    const auth = await ctx.auth.getUserIdentity();
    console.log(auth);

    // Build the query step by step
    const baseQuery = ctx.db.query('orderBook');

    // Apply commodityName filter if provided
    const filteredQuery =
      args.commodityName !== undefined
        ? baseQuery.withIndex('by_commodityName', (q) => q.eq('commodityName', args.commodityName as string))
        : baseQuery;

    // Apply ordering
    const orderedQuery = filteredQuery.order('desc');

    // Apply pagination or return all results
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

// Search orderBook by name with optional commodityName filter
export const search = query({
  args: {
    query: v.string(),
    commodityName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the query step by step
    const baseQuery = ctx.db.query('orderBook');

    // Apply search with commodityName filter if provided
    const searchedQuery = baseQuery.withSearchIndex('search', (q) => {
      let query = q.search('id', args.query);
      if (args.commodityName !== undefined) {
        query = query.eq('commodityName', args.commodityName as string);
      }
      return query;
    });

    // Take only 10 results
    return await searchedQuery.take(10);
  },
});

// Get all unique commodityName
export const listCommodityName = query({
  args: {},
  handler: async (ctx) => {
    const orderBook = await ctx.db.query('orderBook').collect();
    const commodityNames = new Set(orderBook.map((k) => k.commodityName));
    return Array.from(commodityNames).sort();
  },
});
