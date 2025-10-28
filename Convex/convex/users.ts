import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create or update user mutation
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, username, email, firstName, lastName } = args;

    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        username,
        email,
        firstName,
        lastName,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert('users', {
        clerkId,
        username,
        email,
        firstName,
        lastName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        needsUsernameSelection: false,
      });
      return userId;
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
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

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserMood = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return {
      mood: user?.mood || null,
      userId: args.userId,
    };
  },
});

export const getUserNeedsUsernameSelection = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    return user?.needsUsernameSelection ?? false;
  },
});

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();

    if (existingUser) {
      throw new Error('Username already taken');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.patch(user._id, {
      username: args.username,
      needsUsernameSelection: false,
      updatedAt: Date.now(),
    });

    return { username: args.username };
  },
});

export const checkUsernameAvailability = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();

    return !existingUser;
  },
});

export const updateProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bio: v.optional(v.string()),
    mood: v.optional(v.string()),
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

    const updates: Record<string, any> = {
      updatedAt: Date.now(),
    };

    if (args.firstName !== undefined) updates.firstName = args.firstName;
    if (args.lastName !== undefined) updates.lastName = args.lastName;
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.mood !== undefined) updates.mood = args.mood;

    await ctx.db.patch(user._id, updates);

    return updates;
  },
});

export const getSubscriptionStatus = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    const now = Date.now();
    const isSubscribed = user.subscriptionTier &&
                        user.subscriptionExpiresAt &&
                        user.subscriptionExpiresAt > now;

    return {
      isSubscribed: !!isSubscribed,
      subscriptionTier: user.subscriptionTier || null,
      subscriptionExpiresAt: user.subscriptionExpiresAt || null,
    };
  },
});

export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      clerkId: identity.subject,
      username: identity.nickname || identity.email?.split('@')[0] || `user_${Date.now()}`,
      email: identity.email || '',
      firstName: identity.givenName || '',
      lastName: identity.familyName || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      needsUsernameSelection: !identity.nickname,
    });

    return await ctx.db.get(userId);
  },
});

export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.username))
      .first();
  },
});

export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    excludeUserId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const { query, limit = 20, offset = 0, excludeUserId } = args;

    if (query.length < 2) {
      return [];
    }

    let usersQuery = ctx.db
      .query('users')
      .filter(q =>
        q.or(
          q.eq(q.field('username'), query),
          q.eq(q.field('email'), query)
        )
      );

    if (excludeUserId) {
      usersQuery = usersQuery.filter(q => q.neq(q.field('_id'), excludeUserId));
    }

    const users = await usersQuery.take(limit);

    return users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  },
});
