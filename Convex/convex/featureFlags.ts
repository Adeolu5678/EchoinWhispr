import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Get all feature flags.
 * Returns a map of flag name to enabled status.
 */
export const getFeatureFlags = query({
  args: {},
  handler: async (ctx) => {
    const flags = await ctx.db.query('featureFlags').collect();
    
    // Convert to a simple object for easier consumption
    const flagMap: Record<string, boolean> = {};
    flags.forEach(flag => {
      flagMap[flag.name] = flag.enabled;
    });
    
    return flagMap;
  },
});

/**
 * Get a specific feature flag by name.
 */
export const getFeatureFlag = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const flag = await ctx.db
      .query('featureFlags')
      .withIndex('by_name', q => q.eq('name', args.name))
      .first();
      
    return flag ? flag.enabled : false; // Default to false if not found
  },
});

/**
 * Set a feature flag.
 * This should ideally be protected by an admin check in a real production app.
 */
export const setFeatureFlag = mutation({
  args: {
    name: v.string(),
    enabled: v.boolean(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In a real app, check for admin privileges here
    // const identity = await ctx.auth.getUserIdentity();
    // if (!isAdmin(identity)) throw new Error("Unauthorized");

    const existingFlag = await ctx.db
      .query('featureFlags')
      .withIndex('by_name', q => q.eq('name', args.name))
      .first();

    if (existingFlag) {
      await ctx.db.patch(existingFlag._id, {
        enabled: args.enabled,
        ...(args.description && { description: args.description }),
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('featureFlags', {
        name: args.name,
        enabled: args.enabled,
        description: args.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

/**
 * Initialize default flags if they don't exist.
 * Can be called from a setup script or manually.
 */
export const initializeDefaultFlags = mutation({
  args: {},
  handler: async (ctx) => {
    const defaults = [
      { name: 'CONVERSATION_EVOLUTION', enabled: false, description: 'Allow whispers to evolve into conversations' },
      { name: 'IMAGE_UPLOADS', enabled: false, description: 'Allow image uploads in whispers and messages' },
      { name: 'PROFILE_PICTURES', enabled: false, description: 'Allow users to upload profile pictures' },
      { name: 'USER_PROFILE_EDITING', enabled: false, description: 'Allow users to edit their profiles' },
      { name: 'PUSH_NOTIFICATIONS', enabled: true, description: 'Enable push notification infrastructure' },
      { name: 'LOCATION_BASED_FEATURES', enabled: true, description: 'Enable location-based feature infrastructure' },
      { name: 'WHISPER_CHAINS', enabled: false, description: 'Allow users to reply to their own whispers' },
      { name: 'MYSTERY_WHISPERS', enabled: false, description: 'Allow sending whispers to random users' },
      { name: 'FRIENDS', enabled: true, description: 'Enable friend management features' },
    ];

    for (const def of defaults) {
      const existing = await ctx.db
        .query('featureFlags')
        .withIndex('by_name', q => q.eq('name', def.name))
        .first();

      if (!existing) {
        await ctx.db.insert('featureFlags', {
          name: def.name,
          enabled: def.enabled,
          description: def.description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }
  },
});
