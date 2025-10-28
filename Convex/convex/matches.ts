import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createMatch = mutation({
  args: {
    userId: v.id('users'),
    matchedUserId: v.id('users'),
    interests: v.array(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const matchId = await ctx.db.insert('matches', {
      userId: args.userId,
      matchedUserId: args.matchedUserId,
      interests: args.interests,
      status: args.status,
      matchStatus: 'pending',
      createdAt: Date.now(),
    });
    return matchId;
  },
});

export const getMatchesForUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .collect();
  },
});

export const getPendingMatches = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .filter(q => q.eq(q.field('matchStatus'), 'pending'))
      .collect();
  },
});

export const getConfirmedMatches = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .filter(q => q.eq(q.field('matchStatus'), 'matched'))
      .collect();
  },
});

export const getMutualMatches = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('matches')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .filter(q => q.eq(q.field('matchStatus'), 'matched'))
      .collect();
  },
});

export const updateMatchStatus = mutation({
  args: {
    matchId: v.id('matches'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.matchId, {
      status: args.status,
    });
    return args.matchId;
  },
});

export const getNewMutualMatches = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Get matches where user is matchedUserId and status is 'matched'
    // and matchStatus is 'matched' (mutual match)
    const mutualMatches = await ctx.db
      .query('matches')
      .withIndex('by_matched_user_id', q => q.eq('matchedUserId', args.userId))
      .filter(q => q.eq(q.field('matchStatus'), 'matched'))
      .collect();

    return mutualMatches;
  },
});

export const expressInterest = mutation({
  args: {
    matchId: v.id('matches'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.userId.toString() === args.userId.toString()) {
      await ctx.db.patch(args.matchId, {
        user1Interest: true,
      });
    } else if (match.matchedUserId.toString() === args.userId.toString()) {
      await ctx.db.patch(args.matchId, {
        user2Interest: true,
      });
    } else {
      throw new Error('User not part of this match');
    }

    // Check if both users have expressed interest
    const updatedMatch = await ctx.db.get(args.matchId);
    if (updatedMatch && updatedMatch.user1Interest && updatedMatch.user2Interest) {
      await ctx.db.patch(args.matchId, {
        matchStatus: 'matched',
        matchedAt: Date.now(),
      });
    }

    return args.matchId;
  },
});

export const confirmMatch = mutation({
  args: {
    matchId: v.id('matches'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.matchStatus !== 'matched') {
      throw new Error('Match is not in a confirmable state');
    }

    // Update status to confirmed
    await ctx.db.patch(args.matchId, {
      status: 'confirmed',
    });

    return args.matchId;
  },
});

export const declineMatch = mutation({
  args: {
    matchId: v.id('matches'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    // Update status to declined
    await ctx.db.patch(args.matchId, {
      matchStatus: 'declined',
    });

    return args.matchId;
  },
});

export const markNotificationsAsSeen = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Get matches where user is matchedUserId and matchStatus is 'matched'
    const newMatches = await ctx.db
      .query('matches')
      .withIndex('by_matched_user_id', q => q.eq('matchedUserId', args.userId))
      .filter(q => q.eq(q.field('matchStatus'), 'matched'))
      .collect();

    // Mark them as seen by updating a field or removing them
    // For simplicity, we can update the status or add a seen field
    // Since schema doesn't have a seen field, we'll update matchStatus to 'seen'
    for (const match of newMatches) {
      await ctx.db.patch(match._id, {
        matchStatus: 'seen',
      });
    }

    return newMatches.length;
  },
});