import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a Direct Message conversation (e.g. Investor -> Founder)
export const createDirectMessage = mutation({
  args: {
    participantId: v.id('users'), // The other user
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [user._id, args.participantId],
      type: 'direct',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not authorized');
    }

    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', q => q.eq('conversationId', args.conversationId))
      .collect();
  },
});

// List my conversations
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const conversations = await ctx.db.query('conversations').collect();
    return conversations.filter(c => c.participantIds.includes(user._id));
  },
});

export const getConversation = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return conversation;
  },
});