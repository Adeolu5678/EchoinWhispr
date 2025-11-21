import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

// Send a whisper to another user
export const sendWhisper = mutation({
  args: {
    recipientUsername: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    location: v.optional(v.object({ latitude: v.number(), longitude: v.number() })),
  },
  handler: async (ctx, args) => {
    // Validate content length (max 280 characters as per SSD)
    if (args.content.length > 280) {
      throw new Error('Whisper content must be 280 characters or less');
    }

    if (args.content.trim().length === 0) {
      throw new Error('Whisper content cannot be empty');
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

    // Get recipient
    const recipient = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.recipientUsername))
      .first();

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Don't allow sending whispers to yourself
    if (sender._id === recipient._id) {
      throw new Error('Cannot send whisper to yourself');
    }

    const now = Date.now();

    // Create the whisper
    const whisperId = await ctx.db.insert('whispers', {
      senderId: sender._id,
      recipientId: recipient._id,
      content: args.content.trim(),
      imageUrl: args.imageUrl,
      location: args.location,
      isRead: false,
      createdAt: now,
    });

    return whisperId;
  },
});

// Get whispers received by current user
export const getReceivedWhispers = query({
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

    return await ctx.db
      .query('whispers')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .filter(q => q.eq(q.field('conversationId'), undefined))
      .order('desc')
      .collect();
  },
});

// Get whispers sent by current user
export const getSentWhispers = query({
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

    return await ctx.db
      .query('whispers')
      .withIndex('by_sender', q => q.eq('senderId', user._id))
      .order('desc')
      .collect();
  },
});

// Mark whisper as read
export const markWhisperAsRead = mutation({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Get the whisper to verify ownership
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error('Whisper not found');
    }

    // Only recipient can mark as read
    if (whisper.recipientId !== user._id) {
      throw new Error('Not authorized to mark this whisper as read');
    }

    // Update the whisper
    await ctx.db.patch(args.whisperId, {
      isRead: true,
      readAt: Date.now(),
    });

    return args.whisperId;
  },
});

// Get unread whisper count for current user
export const getUnreadWhisperCount = query({
  args: {},
  handler: async ctx => {
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

    const unreadWhispers = await ctx.db
      .query('whispers')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .filter(q => q.eq(q.field('isRead'), false))
      .filter(q => q.eq(q.field('conversationId'), undefined))
      .collect();

    return unreadWhispers.length;
  },
});
// Get a specific whisper by ID (only accessible by recipient)
export const getWhisperById = query({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error('Whisper not found');
    }

    // Only recipient can view the whisper
    if (whisper.recipientId !== user._id) {
      throw new Error('Not authorized to view this whisper');
    }

    return whisper;
  },
});

// Reply to a whisper (Whisper Chains)
export const replyToWhisper = mutation({
  args: {
    parentWhisperId: v.id('whispers'),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    // 1. Check Feature Flag
    const featureFlag = await ctx.db
      .query('featureFlags')
      .withIndex('by_name', q => q.eq('name', 'WHISPER_CHAINS'))
      .first();

    if (!featureFlag || !featureFlag.enabled) {
      throw new Error('Whisper Chains feature is currently disabled');
    }

    // 2. Get Parent Whisper
    const parentWhisper = await ctx.db.get(args.parentWhisperId);
    if (!parentWhisper) throw new Error('Parent whisper not found');

    // 3. Validate Ownership (Can only reply to own whispers in a chain context)
    // The requirement says "replying to their own whispers".
    if (parentWhisper.senderId !== user._id) {
      throw new Error('Can only reply to your own whispers to create a chain');
    }

    // 4. Determine Chain ID
    const chainId = parentWhisper.chainId || parentWhisper._id;

    // 5. Determine Chain Order
    // Find the last whisper in this chain to increment order
    const lastWhisperInChain = await ctx.db
      .query('whispers')
      .withIndex('by_chain', q => q.eq('chainId', chainId))
      .order('desc')
      .first();
    
    const chainOrder = lastWhisperInChain && lastWhisperInChain.chainOrder 
      ? lastWhisperInChain.chainOrder + 1 
      : 1; // 0 is the original whisper (if we backfill) or 1 is the first reply

    // 6. Create Reply Whisper
    const whisperId = await ctx.db.insert('whispers', {
      senderId: user._id,
      recipientId: parentWhisper.recipientId, // Chain continues to same recipient
      content: args.content,
      imageUrl: args.imageUrl,
      isRead: false,
      createdAt: Date.now(),
      parentWhisperId: args.parentWhisperId,
      chainId: chainId,
      chainOrder: chainOrder,
    });

    // 7. If parent didn't have chainId, update it (it's now the start of a chain)
    if (!parentWhisper.chainId) {
      await ctx.db.patch(parentWhisper._id, {
        chainId: parentWhisper._id,
        chainOrder: 0,
        isChainStart: true,
      });
    }

    return whisperId;
  },
});

// Get a full whisper chain
export const getWhisperChain = query({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');

    const targetWhisper = await ctx.db.get(args.whisperId);
    if (!targetWhisper) throw new Error('Whisper not found');

    // Determine Chain ID
    const chainId = targetWhisper.chainId || targetWhisper._id;

    // Fetch all whispers in the chain
    const chain = await ctx.db
      .query('whispers')
      .withIndex('by_chain', q => q.eq('chainId', chainId))
      .collect();

    // If chain is empty (single whisper case where chainId wasn't set yet), return just the whisper
    if (chain.length === 0) {
        return [targetWhisper];
    }

    // Sort by chain order
    return chain.sort((a, b) => (a.chainOrder || 0) - (b.chainOrder || 0));
  },
});
