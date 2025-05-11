import { paginationOptsValidator } from 'convex/server';
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get a single komoditas by ID
export const get = query({
  args: { id: v.id('komoditas') },
  returns: v.union(
    v.object({
      _id: v.id('komoditas'),
      _creationTime: v.number(),
      name: v.string(),
      description: v.optional(v.string()),
      category: v.string(),
      unit: v.string(),
      pricePerUnit: v.number(),
      stock: v.number(),
      imageUrl: v.optional(v.string()),
      createdBy: v.string(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const komoditas = await ctx.db.get(args.id);
    return komoditas;
  },
});

// List all komoditas with optional pagination
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the query step by step
    const baseQuery = ctx.db.query('komoditas');

    // Apply category filter if provided
    const filteredQuery =
      args.category !== undefined
        ? baseQuery.withIndex('by_category', (q) => q.eq('category', args.category as string))
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

// Search komoditas by name with optional category filter
export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the query step by step
    const baseQuery = ctx.db.query('komoditas');

    // Apply search with category filter if provided
    const searchedQuery = baseQuery.withSearchIndex('search_komoditas', (q) => {
      let query = q.search('name', args.query);
      if (args.category !== undefined) {
        query = query.eq('category', args.category as string);
      }
      return query;
    });

    // Take only 10 results
    return await searchedQuery.take(10);
  },
});

// Get all unique categories
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const komoditas = await ctx.db.query('komoditas').collect();
    const categories = new Set(komoditas.map((k) => k.category));
    return Array.from(categories).sort();
  },
});
