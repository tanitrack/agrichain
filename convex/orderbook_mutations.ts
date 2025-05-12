import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createFromListing = mutation({
  args: {
    komoditasId: v.id('komoditas'),
    quantity: v.number(),
    buyerUserId: v.id('users'), // Optional: If you want to pass buyerUserId
    buyerSolanaPublicKey: v.string(), // Optional: If you want to pass buyerSolanaPublicKey
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.subject || !identity.issuer) {
      // Check issuer for Convex standard auth
      throw new Error('Unauthorized: Buyer must be logged in.');
    }

    const { buyerUserId, buyerSolanaPublicKey } = args;

    // 1. Fetch Buyer's User Data (including Solana Public Key)
    const buyerUser = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('_id'), buyerUserId))
      .first();
    if (!buyerUser) {
      throw new Error('Buyer not found.');
    }

    // 2. Fetch Komoditas Data
    const komoditas = await ctx.db.get(args.komoditasId);
    if (!komoditas) {
      throw new Error('Commodity not found.');
    }
    if (args.quantity > komoditas.stock) {
      throw new Error('Insufficient stock for the requested quantity.');
    }
    const sellerSolanaPublicKey = komoditas.sellerSolanaPublicKey; // Already stored in Phase 1
    const sellerUserId = komoditas.createdBy; // This is the Convex _id of the farmer user

    // 3. Calculate Total Amount (ensure pricePerUnit is a number)
    const agreedPricePerUnit = Number(komoditas.pricePerUnit);
    if (isNaN(agreedPricePerUnit)) {
      throw new Error('Invalid price per unit for the commodity.');
    }
    const totalAmount = agreedPricePerUnit * args.quantity;
    const amountLamports = totalAmount * 1_000_000_000; // Example: Assuming price is in SOL, convert to lamports. Adjust if price is in IDR then converted to SOL.

    const now = Date.now();

    // 4. Create OrderBook Record
    // The financialTransactionId will be linked *after* the on-chain transaction is successful
    const orderBookId = await ctx.db.insert('orderBook', {
      buyerId: buyerUserId,
      sellerId: sellerUserId,
      komoditasId: args.komoditasId,
      quantity: args.quantity,
      agreedPricePerUnit: agreedPricePerUnit,
      totalAmount: totalAmount, // Store in native currency (e.g. IDR or SOL representation before lamports)
      status: 'awaiting_escrow_payment', // Initial status for TaniTrack workflow
      buyerSolanaPublicKey: buyerSolanaPublicKey,
      sellerSolanaPublicKey: sellerSolanaPublicKey,
      // financialTransactionId will be set after transaction record is created in recordEscrowInit
      updatedAt: now,
      // _creationTime is automatic
    });

    // 5. Return necessary data to frontend for Solana transaction
    // The frontend will use orderBookId as the orderDetails for the on-chain tx
    return {
      orderBookId: orderBookId, // Used as `orderDetails` on-chain
      sellerSolanaPublicKey: sellerSolanaPublicKey,
      buyerSolanaPublicKey: buyerSolanaPublicKey, // Payer of initialize tx
      amountLamports: amountLamports,
    };
  },
});

// Potentially add other orderBook mutations like `createRequest` (buyer posts a general need)
// and `farmerAcceptsOrderRequest` (farmer accepts a buyer's general request) later.
// For now, `createFromListing` is the primary path.

export const markAsShipped = mutation({
  args: {
    orderBookId: v.id('orderBook'),
    shippingDetails: v.optional(
      v.object({
        courier: v.optional(v.string()),
        trackingNumber: v.optional(v.string()),
        estimatedDeliveryDate: v.optional(v.string()), // Or v.number() for timestamp
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || orderBook.sellerId !== identity.subject) {
      throw new Error('Unauthorized or OrderBook not found.');
    }
    if (orderBook.status !== 'seller_confirmed_awaiting_shipment' /* or similar */) {
      throw new Error('Order cannot be marked as shipped in its current state.');
    }

    const updates: Partial<typeof orderBook> = {
      status: 'shipped',
      updatedAt: Date.now(),
    };
    if (args.shippingDetails) {
      // Assuming schema has these fields: shippingCourier, shippingTrackingNumber, shippingEstimatedDelivery, shippingNotes
      if (args.shippingDetails.courier) updates.shippingCourier = args.shippingDetails.courier;
      if (args.shippingDetails.trackingNumber)
        updates.shippingTrackingNumber = args.shippingDetails.trackingNumber;
      if (args.shippingDetails.estimatedDeliveryDate)
        updates.shippingEstimatedDelivery = args.shippingDetails.estimatedDeliveryDate;
      if (args.shippingDetails.notes) updates.shippingNotes = args.shippingDetails.notes;
    }

    await ctx.db.patch(args.orderBookId, updates);

    // TODO: Notify buyer
    // console.log(`Order ${args.orderBookId} marked as shipped. Buyer ID: ${orderBook.buyerId}`);

    return { success: true };
  },
});

export const buyerConfirmsGoodsReceipt = mutation({
  args: { orderBookId: v.id('orderBook') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orderBook = await ctx.db.get(args.orderBookId);

    if (!identity || !orderBook || orderBook.buyerId !== identity.subject) {
      throw new Error('Unauthorized or OrderBook not found.');
    }
    // Ensure order is in a state where it can be confirmed as received
    if (
      orderBook.status !== 'shipped' /* and potentially other statuses like 'delivery_attempted' */
    ) {
      throw new Error('Order cannot be confirmed as received in its current state.');
    }

    await ctx.db.patch(args.orderBookId, {
      status: 'goods_received', // This status signals the seller can now withdraw
      updatedAt: Date.now(),
    });

    // TODO: Notify seller they can withdraw funds
    // console.log(`Buyer confirmed receipt for Order ${args.orderBookId}. Seller ID: ${orderBook.sellerId}`);

    return { success: true };
  },
});
