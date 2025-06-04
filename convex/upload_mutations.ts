import { v } from 'convex/values';
import { action, mutation, query } from './_generated/server'; // Added query

// Action to generate a pre-signed URL for uploading files
export const generateUploadUrl = action({
  handler: async (ctx) => {
    // Request a an upload URL for a file
    return await ctx.storage.generateUploadUrl();
  },
});

// Mutation to save the storage ID to a document
export const saveKomoditasImage = mutation({
  // Renamed mutation
  args: {
    storageId: v.id('_storage'),
    komoditasId: v.id('komoditas'),
  },
  handler: async (ctx, args) => {
    const komoditas = await ctx.db.get(args.komoditasId);
    if (!komoditas) {
      throw new Error('Komoditas document not found');
    }
    await ctx.db.patch(args.komoditasId, { imageStorageId: args.storageId }); // Changed imageUrl to imageStorageId
    console.log(
      'Image saved with storage ID:',
      args.storageId,
      'for Komoditas ID:',
      args.komoditasId
    );
  },
});

// Query to get the public URL for a storage ID
export const getImageUrl = query({
  // Changed from action to query
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
