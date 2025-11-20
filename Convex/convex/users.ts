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
    // SSD Fields
    career: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    mood: v.optional(v.string()),
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
        // Update SSD fields if provided
        ...(args.career !== undefined ? { career: args.career } : {}),
        ...(args.interests !== undefined ? { interests: args.interests } : {}),
        ...(args.mood !== undefined ? { mood: args.mood } : {}),
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new user
      // Default displayName to username initially
      return await ctx.db.insert('users', {
        clerkId: args.clerkId,
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        displayName: args.username, 
        // Initialize SSD fields
        career: args.career,
        interests: args.interests,
        mood: args.mood,
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
    const fetchSize = limit + offset + 1;

    // Use database indexes for efficient searching
    // Search by username (case-insensitive)
    const usernameResults = await ctx.db
      .query('users')
      .withIndex('by_username', q =>
        q
          .gte('username', searchQuery.toLowerCase())
          .lte('username', searchQuery.toLowerCase() + '\uffff')
      )
      .take(fetchSize);

    // Search by email (case-insensitive) if no username results or need more results
    let emailResults: Doc<'users'>[] = [];
    if (usernameResults.length < fetchSize) {
      emailResults = await ctx.db
      .query('users')
        .withIndex('by_email', q =>
          q
            .gte('email', searchQuery.toLowerCase())
            .lte('email', searchQuery.toLowerCase() + '\uffff')
        )
        .take(fetchSize);
    }

    // Search by career (case-insensitive) if still need results
    let careerResults: Doc<'users'>[] = [];
    if (usernameResults.length + emailResults.length < fetchSize) {
      careerResults = await ctx.db
        .query('users')
        .withIndex('by_career', q =>
          q
            .gte('career', searchQuery) // Note: This is case-sensitive unless we normalize data. For now assuming exact or prefix match.
            .lte('career', searchQuery + '\uffff')
        )
        .take(fetchSize);
    }

    // TODO: Implement full-text search for interests if needed. For now, simple prefix match on career.

    // Combine and deduplicate results
    const allResults = [...usernameResults, ...emailResults, ...careerResults];
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
    displayName: v.optional(v.string()),
    // SSD Fields
    career: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
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

    // Update user table for displayName and SSD fields
    const userUpdates: any = { updatedAt: Date.now() };
    if (args.displayName !== undefined) userUpdates.displayName = args.displayName;
    if (args.career !== undefined) userUpdates.career = args.career;
    if (args.interests !== undefined) userUpdates.interests = args.interests;
    if (args.mood !== undefined) userUpdates.mood = args.mood;

    await ctx.db.patch(user._id, userUpdates);

    // Update profiles table for other fields (assuming profiles table exists and is linked)
    // Note: The original code seemed to mix user and profile table updates. 
    // Ideally, we should check if a profile exists and update/create it.
    // For now, we'll assume the profile logic is handled elsewhere or we just update the user if these fields were on user.
    // BUT, looking at schema.ts, 'profiles' is a separate table.
    
    const profile = await ctx.db
        .query('profiles')
        .withIndex('by_user_id', q => q.eq('userId', user._id))
        .first();

    if (profile) {
        await ctx.db.patch(profile._id, {
            bio: args.bio,
            avatarUrl: args.avatarUrl,
            isPublic: args.isPublic,
            updatedAt: Date.now(),
        });
    } else {
        // Create profile if it doesn't exist
        await ctx.db.insert('profiles', {
            userId: user._id,
            bio: args.bio,
            avatarUrl: args.avatarUrl,
            isPublic: args.isPublic ?? false, // Default to private if not specified
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }

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
        displayName: username, // Default display name
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

    const normalizedUsername = args.username.trim().toLowerCase();

    // Validate username format (3-20 chars, lowercase letters, numbers, underscores only)
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(normalizedUsername)) {
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
      .withIndex('by_username', q => q.eq('username', normalizedUsername))
      .first();

    if (existingUser && existingUser._id !== user._id) {
      throw new Error('Username is already taken');
    }

    // Update username
    await ctx.db.patch(user._id, {
      username: normalizedUsername,
      // Also update display name if it matches the old username or is empty
      ...(user.displayName === user.username ? { displayName: normalizedUsername } : {}),
      needsUsernameSelection: false,
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

// Register push notification token
export const registerPushToken = mutation({
  args: {
    token: v.string(),
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
      pushNotificationToken: args.token,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Find a user with matching mood
export const findMoodMatch = query({
  args: { mood: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!currentUser) return null;

    const targetMood = args.mood || currentUser.mood;
    if (!targetMood) return null;

    // Find up to 10 users with the same mood
    const matches = await ctx.db
      .query('users')
      .withIndex('by_mood', q => q.eq('mood', targetMood))
      .take(10);

    // Filter out current user
    const validMatches = matches.filter(u => u._id !== currentUser._id);

    if (validMatches.length === 0) return null;

    // Pick a random one
    const randomIndex = Math.floor(Math.random() * validMatches.length);
    return validMatches[randomIndex];
  },
});
