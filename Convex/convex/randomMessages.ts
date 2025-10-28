import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Send a random message to an anonymous recipient
export const sendRandomMessage = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate content length (max 280 characters as per SSD)
    if (args.content.length > 280) {
      throw new Error('Random message content must be 280 characters or less');
    }

    if (args.content.trim().length === 0) {
      throw new Error('Random message content cannot be empty');
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get sender
    const sender = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!sender) {
      throw new Error('Sender not found');
    }

    // Get a random recipient (placeholder - will be implemented with Hedera integration)
    // For now, select a random user excluding the sender
    const allUsers = await ctx.db.query('users').collect();
    const otherUsers = allUsers.filter(user => user._id !== sender._id);

    if (otherUsers.length === 0) {
      throw new Error('No other users available to send random message');
    }

    // Simple random selection (will be replaced with Hedera equitable distribution)
    const randomIndex = Math.floor(Math.random() * otherUsers.length);
    const recipient = otherUsers[randomIndex];

    const now = Date.now();

    // Create the random message
    const messageId = await ctx.db.insert('randomMessages', {
      senderId: sender._id,
      recipientId: recipient._id,
      content: args.content.trim(),
      status: 'sent',
      createdAt: now,
    });

    // Update sender's random message count
    const currentCount = sender.randomMessageCount || 0;
    await ctx.db.patch(sender._id, {
      randomMessageCount: currentCount + 1,
    });

    return messageId;
  },
});

// Get a random recipient (placeholder for Hedera integration)
export const getRandomRecipient = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Get current user
    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Get all users except current user
    const allUsers = await ctx.db.query('users').collect();
    const otherUsers = allUsers.filter(user => user._id !== currentUser._id);

    if (otherUsers.length === 0) {
      throw new Error('No other users available');
    }

    // Simple random selection (will be replaced with Hedera equitable distribution)
    const randomIndex = Math.floor(Math.random() * otherUsers.length);
    const randomRecipient = otherUsers[randomIndex];

    return randomRecipient._id;
  },
});

// Get current user's random message count
export const getRandomMessageCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return 0;
    }

    return user.randomMessageCount || 0;
  },
});

// Get received random messages for current user
export const getReceivedRandomMessages = query({
  args: {},
  handler: async (ctx) => {
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

    return await ctx.db
      .query('randomMessages')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .order('desc')
      .collect();
  },
});

// Get sent random messages for current user
export const getSentRandomMessages = query({
  args: {},
  handler: async (ctx) => {
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

    return await ctx.db
      .query('randomMessages')
      .withIndex('by_sender', q => q.eq('senderId', user._id))
      .order('desc')
      .collect();
  },
});