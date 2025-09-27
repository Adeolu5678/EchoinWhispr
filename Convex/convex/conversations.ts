import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Initiate a conversation from a whisper.
 * This creates a conversation record with status 'initiated'.
 */
export const initiateConversation = mutation({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be authenticated');
    }

    // Get the user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Get the whisper to ensure it exists and user is the recipient
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error('Whisper not found');
    }

    if (whisper.recipientId !== user._id) {
      throw new Error(
        'Unauthorized: Only the recipient can initiate a conversation'
      );
    }

    // Check if a conversation already exists for this whisper
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_initial_whisper', q => q.eq('initialWhisperId', args.whisperId))
      .first();

    if (existingConversation) {
      throw new Error('Conversation already exists for this whisper');
    }

    const now = Date.now();

    // Create the conversation
    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [whisper.senderId, whisper.recipientId],
      initialWhisperId: args.whisperId,
      status: 'initiated',
      createdAt: now,
      updatedAt: now,
    });

    return conversationId;
  },
});

/**
 * Get initiated conversations for the current user.
 */
export const getInitiatedConversations = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get initiated conversations where user is a participant
    const conversations = await ctx.db
      .query('conversations')
      .filter(q => q.eq(q.field('status'), 'initiated'))
      .collect();

    return conversations.filter(c => c.participantIds.includes(user._id));
  },
});

/**
 * Get active conversations for the current user.
 */
export const getActiveConversations = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get active conversations where user is a participant
    const conversations = await ctx.db
      .query('conversations')
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();

    return conversations.filter(c => c.participantIds.includes(user._id));
  },
});