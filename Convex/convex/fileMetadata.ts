import { v } from 'convex/values';
import { internalQuery, internalMutation } from './_generated/server';
import { Id } from './_generated/dataModel';

export const getByStorageId = internalQuery({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const metadata = await ctx.db
      .query('fileMetadata')
      .withIndex('by_storage_id', q => q.eq('storageId', args.storageId as Id<'_storage'>))
      .first();

    return metadata;
  },
});

export const create = internalMutation({
  args: {
    storageId: v.string(),
    ownerId: v.id('users'),
    fileName: v.optional(v.string()),
    mimeType: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const existing = await ctx.db
      .query('fileMetadata')
      .withIndex('by_storage_id', q => q.eq('storageId', args.storageId as Id<'_storage'>))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert('fileMetadata', {
      storageId: args.storageId as Id<'_storage'>,
      ownerId: args.ownerId,
      fileName: args.fileName,
      mimeType: args.mimeType,
      size: args.size,
      createdAt: now,
    });
  },
});

export const deleteByStorageId = internalMutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const metadata = await ctx.db
      .query('fileMetadata')
      .withIndex('by_storage_id', q => q.eq('storageId', args.storageId as Id<'_storage'>))
      .first();

    if (metadata) {
      await ctx.db.delete(metadata._id);
    }
  },
});
