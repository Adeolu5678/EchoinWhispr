import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const recordTokenTransaction = mutation({
  args: {
    userId: v.id('users'),
    transactionType: v.string(),
    amount: v.number(),
    recipientId: v.optional(v.id('users')),
    whisperId: v.optional(v.id('whispers')),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert('tokenTransactions', {
      userId: args.userId,
      transactionType: args.transactionType,
      amount: args.amount,
      recipientId: args.recipientId,
      whisperId: args.whisperId,
      createdAt: Date.now(),
    });
    return transactionId;
  },
});

export const getTokenTransactionsForUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('tokenTransactions')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .order('desc')
      .collect();
  },
});

export const getTokenTransactionsForWhisper = query({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('tokenTransactions')
      .withIndex('by_whisper_id', q => q.eq('whisperId', args.whisperId))
      .order('desc')
      .collect();
  },
});

export const getTotalTokensEarned = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query('tokenTransactions')
      .withIndex('by_user_id', q => q.eq('userId', args.userId))
      .collect();

    return transactions.reduce((total, tx) => {
      if (tx.transactionType === 'earned' || tx.transactionType === 'received') {
        return total + tx.amount;
      }
      return total;
    }, 0);
  },
});