import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getUserUsage = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const usageRecords = await ctx.db
      .query('usageLimits')
      .withIndex('by_user_date', q => q.eq('userId', args.userId).eq('date', today))
      .collect();

    const usage = {
      moodMatches: 0,
      romanceSwipes: 0,
      randomMessages: 0,
    };

    usageRecords.forEach(record => {
      if (record.feature === 'mood_matches') {
        usage.moodMatches = record.count;
      } else if (record.feature === 'romance_swipes') {
        usage.romanceSwipes = record.count;
      } else if (record.feature === 'random_messages') {
        usage.randomMessages = record.count;
      }
    });

    return usage;
  },
});

export const incrementUsage = mutation({
  args: {
    userId: v.id('users'),
    feature: v.union(v.literal('mood_matches'), v.literal('romance_swipes'), v.literal('random_messages')),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const records = await ctx.db
      .query('usageLimits')
      .withIndex('by_user_date', q => q.eq('userId', args.userId).eq('date', today))
      .collect();

    const record = records.find(r => r.feature === args.feature);

    if (record) {
      await ctx.db.patch(record._id, { count: record.count + 1 });
    } else {
      await ctx.db.insert('usageLimits', {
        userId: args.userId,
        date: today,
        feature: args.feature,
        count: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getUsageLimits = query({
  args: {},
  handler: async (ctx) => {
    // Configurable limits - could be moved to database or env vars later
    return {
      moodMatches: 2,
      romanceSwipes: 10,
      randomMessages: 5,
    };
  },
});