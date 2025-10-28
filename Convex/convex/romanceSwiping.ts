import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { api } from './_generated/api';

/**
 * Get swipeable personas for the current user.
 * Returns personas that the user hasn't swiped on yet, excluding themselves.
 */
export const getSwipeablePersonas = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Not authenticated');

    // Get current user
    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', user.subject))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Get users that current user has already swiped on
    const swipedUserIds = await ctx.db
      .query('swipeHistory')
      .withIndex('by_swiper', (q) => q.eq('swiperId', currentUser._id))
      .collect()
      .then((swipes) => swipes.map((swipe) => swipe.swipedUserId));

    // Add current user to exclude list
    swipedUserIds.push(currentUser._id);

    // Get personas that haven't been swiped on yet
    const personas = await ctx.db
      .query('users')
      .filter((q) =>
        q.and(
          ...swipedUserIds.map(id => q.neq(q.field('_id'), id))
        )
      )
      .take(50); // Limit to 50 for performance

    return personas.map((persona) => ({
      id: persona._id,
      username: persona.username,
      firstName: persona.firstName,
      lastName: persona.lastName,
      bio: persona.bio,
      skills: persona.skills || [],
      interests: persona.interests || [],
      humor: persona.humor,
      career: persona.career,
      expertise: persona.expertise,
    }));
  },
});

/**
 * Get current user's swipe limits for today.
 */
export const getSwipeLimits = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Not authenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', user.subject))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Use the unified usage tracking system
    const usageLimits: { moodMatches: number; romanceSwipes: number; randomMessages: number } = await ctx.runQuery(api.usageLimits.getUsageLimits);
    const userUsage: { moodMatches: number; romanceSwipes: number; randomMessages: number } = await ctx.runQuery(api.usageLimits.getUserUsage, { userId: currentUser._id });

    const hasUnlimited = currentUser.unlimitedMatches || false;
    const limit: number = usageLimits.romanceSwipes;
    const currentSwipes: number = userUsage.romanceSwipes;

    return {
      remainingSwipes: hasUnlimited ? Infinity : Math.max(0, limit - currentSwipes),
      currentSwipes,
      limit: hasUnlimited ? Infinity : limit,
      hasUnlimited,
    };
  },
});

/**
 * Record a swipe action (like/dislike).
 */
export const recordSwipe = mutation({
  args: {
    swipedUserId: v.id('users'),
    action: v.union(v.literal('like'), v.literal('dislike')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Not authenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', user.subject))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Check daily limits using unified system
    const hasUnlimited = currentUser.unlimitedMatches || false;

    if (!hasUnlimited) {
      const usageLimits = await ctx.runQuery(api.usageLimits.getUsageLimits);
      const userUsage = await ctx.runQuery(api.usageLimits.getUserUsage, { userId: currentUser._id });

      if (userUsage.romanceSwipes >= usageLimits.romanceSwipes) {
        throw new Error('Daily swipe limit reached');
      }
    }

    // Increment usage in unified system
    await ctx.runMutation(api.usageLimits.incrementUsage, {
      userId: currentUser._id,
      feature: 'romance_swipes',
    });

    // Record the swipe
    await ctx.db.insert('swipeHistory', {
      swiperId: currentUser._id,
      swipedUserId: args.swipedUserId,
      action: args.action,
      createdAt: Date.now(),
    });

    // If it's a like, check for mutual match
    if (args.action === 'like') {
      const mutualSwipe = await ctx.db
        .query('swipeHistory')
        .withIndex('by_swiper', (q) => q.eq('swiperId', args.swipedUserId))
        .filter((q) =>
          q.and(
            q.eq(q.field('swipedUserId'), currentUser._id),
            q.eq(q.field('action'), 'like')
          )
        )
        .first();

      if (mutualSwipe) {
        // Create a match record using the mutual matching system
        await ctx.runMutation(api.matches.createMatch, {
          userId: currentUser._id,
          matchedUserId: args.swipedUserId,
          interests: [], // Could be populated based on user interests
          status: 'matched',
        });

        // Also create the reverse match record
        await ctx.runMutation(api.matches.createMatch, {
          userId: args.swipedUserId,
          matchedUserId: currentUser._id,
          interests: [],
          status: 'matched',
        });
      }
    }

    return { success: true };
  },
});

/**
 * Undo the last swipe action.
 */
export const undoSwipe = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error('Not authenticated');

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', user.subject))
      .first();

    if (!currentUser) throw new Error('User not found');

    // Get the most recent swipe
    const lastSwipe = await ctx.db
      .query('swipeHistory')
      .withIndex('by_swiper', (q) => q.eq('swiperId', currentUser._id))
      .order('desc')
      .first();

    if (!lastSwipe) {
      throw new Error('No swipe to undo');
    }

    // Delete the swipe record
    await ctx.db.delete(lastSwipe._id);

    // Decrement usage in unified system (only if not unlimited)
    const hasUnlimited = currentUser.unlimitedMatches || false;
    if (!hasUnlimited) {
      // Note: The unified system doesn't have a decrement function yet
      // For now, we'll need to handle this differently or add decrement functionality
      // This is a limitation that should be addressed in the usageLimits system
    }

    // If it was a like that created a match, we might need to handle match cleanup
    // For simplicity, matches are kept even after undo

    return { success: true };
  },
});