// convex/orderbook_mutations.ts
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

export const createFromListing = mutation({
  args: {
    komoditasId: v.id('komoditas'),
    quantity: v.number(),
    // buyerUserId is implicitly from ctx.auth, no need to pass from client if using auth
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.subject || !identity.issuer) {
      // Check issuer for Convex standard auth
      throw new Error('Unauthorized: Buyer must be logged in.');
    }
    const buyerConvexUserId = identity.subject as Id<'users'>; // Dynamic's userId mapping to Convex user _id

    // 1. Fetch Buyer's User Data (including Solana Public Key)
    const buyerUser = await ctx.db.get(buyerConvexUserId);
    if (!buyerUser || !buyerUser.solanaPublicKey) {
      throw new Error("Buyer's Solana public key not found. Please complete your profile.");
    }
    const buyerSolanaPublicKey = buyerUser.solanaPublicKey;

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
      buyerId: buyerConvexUserId,
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
