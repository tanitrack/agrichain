import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import users from './auth.schemas.users';

export default defineSchema({
  users,
  komoditas: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    unit: v.string(), // e.g., "kg", "ton", "piece"
    pricePerUnit: v.number(), // Base price
    stock: v.number(),
    grade: v.optional(v.string()),
    harvestDate: v.optional(v.string()),
    farmersName: v.optional(v.string()),
    address: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdBy: v.id('users'), // Link to the farmer's user record in Convex
    sellerSolanaPublicKey: v.string(), // Farmer's Solana public key
    updatedAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_name', ['name'])
    .index('by_createdBy', ['createdBy']) // Good for fetching all commodities by a farmer
    .searchIndex('search_komoditas', {
      searchField: 'name',
      filterFields: ['category', 'createdBy'],
    }),
  komoditas_bulk: defineTable({
    commodityId: v.string(),
    minQuantity: v.string(),
    price: v.number(), // Base price
    createdBy: v.id('users'), // Link to the farmer's user record in Convex
    sellerSolanaPublicKey: v.string(), // Farmer's Solana public key
    updatedAt: v.number(),
  }).index('by_commodity_id', ['commodityId']),

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
  orderBook: defineTable({
    buyerId: v.id('users'),
    sellerId: v.optional(v.id('users')), // Optional if buyer creates a general request first
    komoditasId: v.id('komoditas'),
    quantity: v.number(),
    agreedPricePerUnit: v.number(),
    totalAmount: v.number(), // quantity * agreedPricePerUnit
    status: v.string(), // e.g., "awaiting_payment_for_escrow", "escrow_funded", "seller_confirmed", "shipped", "goods_received", "completed", "cancelled"
    buyerSolanaPublicKey: v.string(),
    sellerSolanaPublicKey: v.string(), // Denormalized from komoditas.sellerSolanaPublicKey or users table
    financialTransactionId: v.optional(v.id('transaction')), // Link to the on-chain transaction log
    shippingAddress: v.optional(v.string()),
    shippingNotes: v.optional(v.string()),
    termsAndConditions: v.optional(v.string()), // Could be text or a link to a document
    updatedAt: v.number(), // Manually manage for status updates
  })
    .index('by_buyerId_status', ['buyerId', 'status'])
    .index('by_sellerId_status', ['sellerId', 'status'])
    .index('by_komoditasId', ['komoditasId']),
  transaction: defineTable({
    orderBookId: v.id('orderBook'), // This is the orderDetails stored on-chain
    buyerSolanaPublicKey: v.string(),
    sellerSolanaPublicKey: v.string(),
    amountLamports: v.number(),
    escrowPdaAddress: v.string(),
    onChainEscrowStatus: v.string(), // "initialized", "confirmed", "completed", "refunded", "failed", "closed"
    initializeTxHash: v.string(),
    confirmOrderTxHash: v.optional(v.string()),
    withdrawFundsTxHash: v.optional(v.string()),
    refundOrderTxHash: v.optional(v.string()),
    failOrderTxHash: v.optional(v.string()),
    closeEscrowTxHash: v.optional(v.string()),

    // Convex default fields _id, _creationTime
    updatedAt: v.number(), // Manually manage for status updates
  })
    .index('by_orderBookId', ['orderBookId'])
    .index('by_escrowPdaAddress', ['escrowPdaAddress']), // Might be useful
});
