import { paginationOptsValidator } from 'convex/server';
import { query } from './_generated/server';
import { v } from 'convex/values';

// Get a single komoditas by ID
export const get = query({
  args: { id: v.id('komoditas') },

  handler: async (ctx, args) => {
    const komoditas = await ctx.db.get(args.id);
    return komoditas;
  },
});

export const getFarmerOrderSummary = query({
  args: {
    farmerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Ambil semua order milik farmer
    const farmerOrders = await ctx.db
      .query('orderBook')
      .filter((q) => q.eq(q.field('sellerId'), args.farmerId))
      .collect();

    // Hitung total quantity
    const totalQuantity = farmerOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    // Hitung distinct komoditasId
    const uniqueKomoditasIds = new Set(
      farmerOrders
        .filter(order => order.komoditasId)
        .map(order => order.komoditasId)
    );
    const distinctCommodities = uniqueKomoditasIds.size;

    return {
      totalQuantity,
      distinctCommodities,
      totalOrders: farmerOrders.length
    };
  },
});

export const getFarmerCompletedOrderSummary = query({
  args: {
    farmerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Return default jika farmerId tidak ada
    if (!args.farmerId) {
      return {
        totalAmount: 0,
        totalTransactions: 0,
        distinctCommodities: 0
      };
    }

    // Ambil semua order milik farmer dengan status completed
    const completedOrders = await ctx.db
      .query('orderBook')
      .filter((q) =>
        q.and(
          q.eq(q.field('sellerId'), args.farmerId),
          q.eq(q.field('status'), 'completed')
        )
      )
      .collect();

    // Hitung total amount
    const totalAmount = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Hitung total transaksi
    const totalTransactions = completedOrders.length;

    // Hitung distinct komoditasId
    const uniqueKomoditasIds = new Set(
      completedOrders
        .filter(order => order.komoditasId)
        .map(order => order.komoditasId)
    );
    const distinctCommodities = uniqueKomoditasIds.size;

    return {
      totalAmount,
      totalTransactions,
      distinctCommodities
    };
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
