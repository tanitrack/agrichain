import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  komoditas: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    unit: v.string(), // e.g., "kg", "ton", "piece"
    pricePerUnit: v.number(),
    stock: v.number(),
    imageUrl: v.optional(v.string()),
    createdBy: v.string(), // User ID who created this
    updatedAt: v.number(), // Timestamp
  })
    .index('by_category', ['category'])
    .index('by_name', ['name'])
    .searchIndex('search', {
      searchField: 'name',
      filterFields: ['category'],
    }),
});
