import { action } from './_generated/server';
import { v } from 'convex/values';

/**
 * File storage functions for handling file uploads and management.
 * Provides secure access to Convex's file storage system.
 */

/**
 * Generates an upload URL for file storage.
 * This allows the client to upload files directly to Convex storage.
 * @returns The upload URL string
 */
export const generateUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    // Generate upload URL using Convex's built-in file storage
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
});

/**
 * Gets the public URL for a stored file.
 * @param storageId - The storage ID of the file
 * @returns The public URL string
 */
export const getUrl = action({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const url = await ctx.storage.getUrl(args.storageId);
      return url;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error('Failed to get file URL');
    }
  },
});

/**
 * Deletes a stored file from Convex storage.
 * @param storageId - The storage ID of the file to delete
 */
export const deleteFile = action({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.storage.delete(args.storageId);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  },
});