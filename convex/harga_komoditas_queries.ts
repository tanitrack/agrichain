/* eslint-disable @eslint-react/naming-convention/filename */
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get a single harga komoditas by ID
export const get = query({
  args: { id: v.id('harga_komoditas') },
  returns: v.union(
    v.object({
      _id: v.id('harga_komoditas'),
      _creationTime: v.number(),
      name: v.string(),
      unit: v.string(),
      price: v.string(),
      grade: v.string(),
      prediction: v.string(),
      region: v.string(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const harga_komoditas = await ctx.db.get(args.id);
    return harga_komoditas;
  },
});

// List all harga komoditas with optional pagination
export const list = query({
  args: {
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null()),
      })
    ),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the query step by step
    const baseQuery = ctx.db.query('harga_komoditas');

    // Apply region filter if provided
    const filteredQuery =
      args.region !== undefined
        ? baseQuery.withIndex('by_region', (q) => q.eq('region', args.region as string))
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

// Search harga komoditas by name with optional category filter
export const search = query({
  args: {
    query: v.string(),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Build the query step by step
    const baseQuery = ctx.db.query('harga_komoditas');

    // Apply search with region filter if provided
    const searchedQuery = baseQuery.withSearchIndex('search', (q) => {
      let query = q.search('name', args.query);
      if (args.region !== undefined) {
        query = query.eq('region', args.region as string);
      }
      return query;
    });

    // Take only 10 results
    return await searchedQuery.take(10);
  },
});

// Get all unique regions
export const listregions = query({
  args: {},
  handler: async (ctx) => {
    const harga_komoditas = await ctx.db.query('harga_komoditas').collect();
    const regions = new Set(harga_komoditas.map((k) => k.region));
    return Array.from(regions).sort();
  },
});
