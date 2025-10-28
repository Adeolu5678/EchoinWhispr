import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const sendCareerWhisper = mutation({
  args: {
    senderId: v.id('users'),
    recipientId: v.id('users'),
    career: v.string(),
    content: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const whisperId = await ctx.db.insert('careerWhispers', {
      senderId: args.senderId,
      recipientId: args.recipientId,
      career: args.career,
      content: args.content,
      status: args.status,
      createdAt: Date.now(),
    });
    return whisperId;
  },
});

export const getCareerWhispersByCareer = query({
  args: {
    career: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('careerWhispers')
      .withIndex('by_career', q => q.eq('career', args.career))
      .order('desc')
      .collect();
  },
});

export const getCareerWhispersForUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('careerWhispers')
      .withIndex('by_sender', q => q.eq('senderId', args.userId))
      .order('desc')
      .collect();
  },
});

export const updateCareerWhisperStatus = mutation({
  args: {
    whisperId: v.id('careerWhispers'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.whisperId, {
      status: args.status,
    });
    return args.whisperId;
  },
});