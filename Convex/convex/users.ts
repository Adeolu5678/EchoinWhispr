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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
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
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();
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

// Search users by username or email with pagination and security
export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    excludeUserId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    // Validate input parameters
    const searchQuery = args.query.trim();
    if (searchQuery.length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const limit = Math.min(args.limit || 20, 50); // Max 50 results
    const offset = args.offset || 0;

    // Use database indexes for efficient searching
    // Search by username (case-insensitive)
    const usernameResults = await ctx.db
      .query('users')
      .withIndex('by_username', q =>
        q
          .gte('username', searchQuery.toLowerCase())
          .lte('username', searchQuery.toLowerCase() + '\uffff')
      )
      .take(limit + offset);

    // Search by email (case-insensitive) if no username results or need more results
    let emailResults: Doc<'users'>[] = [];
    if (usernameResults.length < limit + offset) {
      emailResults = await ctx.db
        .query('users')
        .withIndex('by_email', q =>
          q
            .gte('email', searchQuery.toLowerCase())
            .lte('email', searchQuery.toLowerCase() + '\uffff')
        )
        .take(limit + offset);
    }

    // Combine and deduplicate results
    const allResults = [...usernameResults, ...emailResults];
    const uniqueResults = allResults.filter(
      (user, index, self) => index === self.findIndex(u => u._id === user._id)
    );

    // Filter out excluded user if provided
    const filteredResults = args.excludeUserId
      ? uniqueResults.filter(user => user._id !== args.excludeUserId)
      : uniqueResults;

    // Apply pagination
    const paginatedResults = filteredResults.slice(offset, offset + limit);

    // Return results with metadata
    return {
      results: paginatedResults,
      totalCount: filteredResults.length,
      hasMore: filteredResults.length > offset + limit,
    };
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Get current user or create if doesn't exist
export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx): Promise<Doc<'users'> | null> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error('Not authenticated');
      }

      // Validate required Clerk identity fields
      if (!identity.subject || !identity.email) {
        throw new Error('Invalid identity: missing required fields');
      }

      // Check if user already exists
      const existingUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
        .first();

      if (existingUser) {
        console.log(
          'DEBUG: Found existing user:',
          existingUser._id,
          'needsUsernameSelection:',
          existingUser.needsUsernameSelection
        );
        return existingUser;
      }

      // User doesn't exist - create immediately with Clerk-assigned username
      const username =
        identity.nickname ||
        identity.givenName ||
        `user_${identity.subject.slice(0, 8)}`;

      console.log('DEBUG: Creating new user with needsUsernameSelection: true');

      const newUserId = await ctx.db.insert('users', {
        clerkId: identity.subject,
        username: username,
        email: identity.email,
        firstName: identity.givenName,
        lastName: identity.familyName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        needsUsernameSelection: true,
      });

      // Return the newly created user
      const newUser = await ctx.db.get(newUserId);
      console.log(
        'DEBUG: Created new user:',
        newUserId,
        'needsUsernameSelection:',
        newUser?.needsUsernameSelection
      );
      return newUser;
    } catch (error) {
      console.error('Error in getOrCreateCurrentUser:', error);
      throw error;
    }
  },
});

// Update user username
export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Validate username format (3-20 chars, lowercase letters, numbers, underscores only)
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(args.username)) {
      throw new Error(
        'Username must be 3-20 characters long and contain only lowercase letters, numbers, and underscores'
      );
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if username is already taken by another user
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();

    if (existingUser && existingUser._id !== user._id) {
      throw new Error('Username is already taken');
    }

    // Update username
    await ctx.db.patch(user._id, {
      username: args.username,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Check if username is available for registration
export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    // Validate username format (3-20 chars, lowercase letters, numbers, underscores only)
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(args.username)) {
      return false;
    }

    // Check if username already exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();

    return !existingUser; // Return true if username is available (no existing user)
  },
});

// Get current user's username selection status
export const getUserNeedsUsernameSelection = query({
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

    if (!user) {
      return null;
    }

    return user.needsUsernameSelection ?? false;
  },
});
