import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Query to get the current user's subscription status
export const getSubscriptionStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // SUSPENDED: Return 'premium' for all users as we are not yet shipping worldwide
    // This effectively disables the subscription gate.
    return 'premium'; 

    /* Original logic preserved for future enablement:
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    return user.subscriptionStatus || 'free';
    */
  },
});

// Mutation to upgrade a user to premium (Placeholder for actual payment integration)
export const upgradeToPremium = mutation({
  args: { planId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Update user status
    await ctx.db.patch(user._id, {
      subscriptionStatus: 'premium',
      updatedAt: Date.now(),
    });

    // Record subscription
    await ctx.db.insert('subscriptions', {
      userId: user._id,
      planId: args.planId,
      status: 'active',
      startDate: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
