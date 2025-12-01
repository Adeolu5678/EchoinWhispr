import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Get current user or create if doesn't exist
export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) return null;

    if (user.avatarStorageId) {
      const url = await ctx.storage.getUrl(user.avatarStorageId);
      if (url) {
        return { ...user, avatarUrl: url };
      }
    }

    return user;
  },
});

// Create or update user from Clerk webhook
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Launchpad Fields
    role: v.optional(v.union(v.literal('entrepreneur'), v.literal('investor'))),
    professionalBio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    notificationPreferences: v.optional(v.object({
      email: v.boolean(),
      push: v.boolean(),
    })),
    privacySettings: v.optional(v.object({
      profileVisibility: v.union(v.literal('public'), v.literal('private')),
    })),
    avatarStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .unique();

    const now = Date.now();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        avatarUrl: args.avatarUrl,
        professionalBio: args.professionalBio,
        linkedinUrl: args.linkedinUrl,
        // Only update role if it's not set (or allow switching? For now, assume sticky role)
        ...(args.role !== undefined && !existing.role ? { role: args.role } : {}),
        ...(args.skills !== undefined ? { skills: args.skills } : {}),
        ...(args.interests !== undefined ? { interests: args.interests } : {}),
        ...(args.notificationPreferences !== undefined ? { notificationPreferences: args.notificationPreferences } : {}),
        ...(args.privacySettings !== undefined ? { privacySettings: args.privacySettings } : {}),
        ...(args.avatarStorageId !== undefined ? { avatarStorageId: args.avatarStorageId } : {}),
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new user
      return await ctx.db.insert('users', {
        clerkId: args.clerkId,
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        avatarUrl: args.avatarUrl,
        professionalBio: args.professionalBio,
        linkedinUrl: args.linkedinUrl,
        skills: args.skills,
        interests: args.interests,
        notificationPreferences: args.notificationPreferences,
        privacySettings: args.privacySettings,
        avatarStorageId: args.avatarStorageId,
        role: args.role, // Role might be null initially if not selected during signup flow
        createdAt: now,
        updatedAt: now,
        // Legacy field default
        needsUsernameSelection: false,
      });
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();
  },
});

// Set user role
export const setRole = mutation({
  args: { role: v.union(v.literal('entrepreneur'), v.literal('investor')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, { role: args.role });
  },
});

// Search users
export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    excludeUserId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const { query, limit = 20, offset = 0, excludeUserId } = args;

    // For MVP, we'll just fetch all users and filter in memory.
    // In production, we should use Convex's search capabilities (Search Indexes).
    const users = await ctx.db.query('users').collect();

    const lowerQuery = query.toLowerCase();

    const filtered = users.filter(user => {
      if (excludeUserId && user._id === excludeUserId) return false;

      const username = user.username.toLowerCase();
      // Also search by name if available, but prioritize username display
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();

      return username.includes(lowerQuery) || name.includes(lowerQuery);
    });

    // Pagination
    const sliced = filtered.slice(offset, offset + limit);

    return {
      results: sliced.map(u => ({
        _id: u._id,
        username: u.username,
        displayName: u.username, // Force username as display name for anonymity
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        role: u.role,
        career: u.professionalBio,
      })),
      total: filtered.length,
    };
  },
});

// Find a mood match (random user for now)
export const findMoodMatch = query({
  args: {
    mood: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return null;

    // For MVP, just pick a random user who is not the current user
    // In production, this would use vector search or matching logic based on 'mood'
    const users = await ctx.db.query('users').collect();
    const candidates = users.filter(u => u._id !== currentUser._id);
    
    if (candidates.length === 0) return null;

    const match = candidates[Math.floor(Math.random() * candidates.length)];
    
    return {
      _id: match._id,
      username: match.username,
      displayName: match.firstName && match.lastName ? `${match.firstName} ${match.lastName}` : match.firstName || match.username,
      avatarUrl: match.avatarUrl,
      mood: args.mood || "Mysterious", // Echo back the mood or a default
    };
  },
});

export const getUser = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
