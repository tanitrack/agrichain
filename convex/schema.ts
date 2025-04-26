import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  sessions: defineTable({
    userId: v.string(),
    sessionToken: v.string(),
    provider: v.string(),
    lastVerified: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    // Optional user data from Dynamic
    wallet: v.optional(v.string()),
    chainId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  })
    .index('by_session_token', ['sessionToken'])
    .index('by_user', ['userId'])
    .index('by_expiry', ['expiresAt']),
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
  harga_komoditas: defineTable({
    name: v.string(),
    price: v.string(),
    unit: v.string(), // e.g., "kg", "ton", "piece"
    grade: v.string(),
    prediction: v.string(),
    region: v.string(),
    updatedAt: v.number(), // Timestamp
  })
    .index('by_region', ['region'])
    .index('by_name', ['name'])
    .searchIndex('search', {
      searchField: 'name',
      filterFields: ['region'],
    }),
  transaction: defineTable({
    trxId: v.string(),
    customerName: v.string(),
    commodityName: v.string(),
    unit: v.string(), // e.g., "kg", "ton", "piece"
    totalUnit: v.number(),
    status: v.string(),
    type: v.string(),
    unitPrice: v.number(),
    price: v.number(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_trxId', ['trxId'])
    .searchIndex('search', {
      searchField: 'trxId',
      filterFields: ['status'],
    }),
});
