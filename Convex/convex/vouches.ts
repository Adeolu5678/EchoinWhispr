import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a vouch
export const create = mutation({
  args: {
    targetId: v.id('users'),
    relationship: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    if (user._id === args.targetId) {
      throw new Error('Cannot vouch for yourself');
    }

    return await ctx.db.insert('vouches', {
      voucherId: user._id,
      targetId: args.targetId,
      relationship: args.relationship,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

// List vouches for a user
export const list = query({
  args: { targetId: v.id('users') },
  handler: async (ctx, args) => {
    const vouches = await ctx.db
      .query('vouches')
      .withIndex('by_target', (q) => q.eq('targetId', args.targetId))
      .collect();

    // Enrich with voucher details
    const enrichedVouches = await Promise.all(
      vouches.map(async (vouch) => {
        const voucher = await ctx.db.get(vouch.voucherId);
        return {
          ...vouch,
          voucherName: voucher ? `${voucher.firstName} ${voucher.lastName}` : 'Unknown',
          voucherAvatar: voucher?.avatarUrl,
          voucherRole: voucher?.role,
        };
      })
    );

    return enrichedVouches;
  },
});
