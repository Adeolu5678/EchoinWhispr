import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const setUserMood = mutation({
  args: {
    userId: v.id('users'),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    // Update user's mood in the users table
    await ctx.db.patch(args.userId, {
      mood: args.mood,
      updatedAt: Date.now(),
    });

    return { userId: args.userId, mood: args.mood };
  },
});

export const createMoodConnection = mutation({
  args: {
    userId: v.id('users'),
    matchedUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Check if users have the same mood
    const user = await ctx.db.get(args.userId);
    const matchedUser = await ctx.db.get(args.matchedUserId);

    if (!user?.mood || !matchedUser?.mood || user.mood !== matchedUser.mood) {
      throw new Error('Users must have matching moods to connect');
    }

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const existingLimit = await ctx.db
      .query('moodConnectionLimits')
      .withIndex('by_user_date', q => q.eq('userId', args.userId).eq('date', today))
      .first();

    const maxLimit = 5; // Daily limit
    if (existingLimit && existingLimit.count >= maxLimit) {
      throw new Error('Daily mood connection limit reached');
    }

    // Create mood connection
    const connectionId = await ctx.db.insert('moodConnections', {
      userId: args.userId,
      matchedUserId: args.matchedUserId,
      mood: user.mood,
      status: 'pending',
      createdAt: Date.now(),
    });

    // Update or create daily limit
    if (existingLimit) {
      await ctx.db.patch(existingLimit._id, {
        count: existingLimit.count + 1,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('moodConnectionLimits', {
        userId: args.userId,
        date: today,
        count: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return {
      connectionId,
      userId: args.userId,
      matchedUserId: args.matchedUserId,
      mood: user.mood,
      status: 'pending',
    };
  },
});

export const updateConnectionStatus = mutation({
  args: {
    connectionId: v.id('moodConnections'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, {
      status: args.status,
    });

    return { connectionId: args.connectionId, status: args.status };
  },
});

export const getMoodConnectionsForUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('moodConnections')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .collect();
  },
});

export const getDailyLimit = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0];
    const limit = await ctx.db
      .query('moodConnectionLimits')
      .withIndex('by_user_date', q => q.eq('userId', args.userId).eq('date', today))
      .first();

    return {
      count: limit?.count || 0,
      maxLimit: 5,
      date: today,
    };
  },
});

export const getMoodMatches = query({
  args: {
    userId: v.id('users'),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    // Find users with the same mood who haven't been connected yet
    const user = await ctx.db.get(args.userId);
    if (!user?.mood || user.mood !== args.mood) {
      return [];
    }

    // Get existing connections to avoid duplicates
    const existingConnections = await ctx.db
      .query('moodConnections')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .collect();

    const connectedUserIds = new Set(
      existingConnections.map(conn => conn.matchedUserId.toString())
    );

    // Find users with matching mood
    const matchingUsers = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('mood'), args.mood))
      .filter(q => q.neq(q.field('_id'), args.userId))
      .collect();

    // Filter out already connected users
    return matchingUsers.filter(user => !connectedUserIds.has(user._id.toString()));
  },
});