import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { enforceRateLimit, recordRateLimitedAction } from './rateLimits';

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

    // Enforce rate limit (20 whispers per hour)
    await enforceRateLimit(ctx, sender._id, 'SEND_WHISPER');

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

    // Record rate limit action
    await recordRateLimitedAction(ctx, sender._id, 'SEND_WHISPER');

    return whisperId;
  },
});

// Get whispers received by current user (with pagination)
export const getReceivedWhispers = query({
  args: {
    cursor: v.optional(v.id('whispers')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { whispers: [], nextCursor: null, hasMore: false };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return { whispers: [], nextCursor: null, hasMore: false };
    }

    const limit = Math.min(args.limit || 20, 50); // Max 50 per page
    
    let query = ctx.db
      .query('whispers')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .filter(q => q.eq(q.field('conversationId'), undefined))
      .order('desc');

    // If cursor is provided, start from there
    const whispers = await query.take(limit + 1);
    
    // Filter out whispers before cursor if provided
    let filteredWhispers = whispers;
    if (args.cursor) {
      const cursorIndex = whispers.findIndex(w => w._id === args.cursor);
      if (cursorIndex >= 0) {
        filteredWhispers = whispers.slice(cursorIndex + 1);
      }
    }

    const hasMore = filteredWhispers.length > limit;
    const resultWhispers = filteredWhispers.slice(0, limit);
    const nextCursor = hasMore ? resultWhispers[resultWhispers.length - 1]?._id : null;

    return {
      whispers: resultWhispers,
      nextCursor,
      hasMore,
    };
  },
});

// Get whispers sent by current user (with pagination)
export const getSentWhispers = query({
  args: {
    cursor: v.optional(v.id('whispers')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { whispers: [], nextCursor: null, hasMore: false };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return { whispers: [], nextCursor: null, hasMore: false };
    }

    const limit = Math.min(args.limit || 20, 50);

    const whispers = await ctx.db
      .query('whispers')
      .withIndex('by_sender', q => q.eq('senderId', user._id))
      .order('desc')
      .take(limit + 1);

    // Filter out whispers before cursor if provided
    let filteredWhispers = whispers;
    if (args.cursor) {
      const cursorIndex = whispers.findIndex(w => w._id === args.cursor);
      if (cursorIndex >= 0) {
        filteredWhispers = whispers.slice(cursorIndex + 1);
      }
    }

    const hasMore = filteredWhispers.length > limit;
    const resultWhispers = filteredWhispers.slice(0, limit);
    const nextCursor = hasMore ? resultWhispers[resultWhispers.length - 1]?._id : null;

    return {
      whispers: resultWhispers,
      nextCursor,
      hasMore,
    };
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

    // OPTIMIZATION: Use .take() with a reasonable limit instead of .collect()
    // This returns an approximate count for UI purposes without fetching all records
    const unreadWhispers = await ctx.db
      .query('whispers')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .filter(q => q.eq(q.field('isRead'), false))
      .filter(q => q.eq(q.field('conversationId'), undefined))
      .take(100); // Cap at 100 for performance

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

// ============================================================
// QUICK WINS FEATURES
// ============================================================

// === EMOJI REACTIONS ===

// Add or remove a reaction to a whisper
export const toggleReaction = mutation({
  args: {
    whisperId: v.id('whispers'),
    emoji: v.string(),
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

    // User must be part of the whisper (sender or recipient)
    if (whisper.senderId !== user._id && whisper.recipientId !== user._id) {
      throw new Error('Not authorized to react to this whisper');
    }

    const reactions = whisper.reactions || [];
    const existingIndex = reactions.findIndex(
      r => r.userId === user._id && r.emoji === args.emoji
    );

    if (existingIndex >= 0) {
      // Remove reaction (toggle off)
      reactions.splice(existingIndex, 1);
    } else {
      // Add reaction
      reactions.push({
        userId: user._id,
        emoji: args.emoji,
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(args.whisperId, { reactions });

    return { success: true, added: existingIndex < 0 };
  },
});

// === VOICE WHISPERS ===

// Generate upload URL for voice message
export const generateVoiceUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Send a voice whisper
export const sendVoiceWhisper = mutation({
  args: {
    recipientUsername: v.string(),
    audioStorageId: v.id('_storage'),
    audioDuration: v.number(),
    isVoiceModulated: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const sender = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!sender) {
      throw new Error('Sender not found');
    }

    const recipient = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.recipientUsername))
      .first();

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    if (sender._id === recipient._id) {
      throw new Error('Cannot send whisper to yourself');
    }

    const whisperId = await ctx.db.insert('whispers', {
      senderId: sender._id,
      recipientId: recipient._id,
      content: "🎤 Voice message", // Placeholder content
      audioStorageId: args.audioStorageId,
      audioDuration: args.audioDuration,
      isVoiceModulated: args.isVoiceModulated,
      isRead: false,
      createdAt: Date.now(),
    });

    return whisperId;
  },
});

// Get voice message URL
export const getVoiceMessageUrl = query({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// === MESSAGE SCHEDULING ===

// Schedule a whisper for future delivery
export const scheduleWhisper = mutation({
  args: {
    recipientUsername: v.string(),
    content: v.string(),
    scheduledFor: v.number(), // Timestamp
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.content.length > 280) {
      throw new Error('Whisper content must be 280 characters or less');
    }

    if (args.scheduledFor <= Date.now()) {
      throw new Error('Scheduled time must be in the future');
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const sender = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!sender) {
      throw new Error('Sender not found');
    }

    const recipient = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.recipientUsername))
      .first();

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    if (sender._id === recipient._id) {
      throw new Error('Cannot send whisper to yourself');
    }

    const whisperId = await ctx.db.insert('whispers', {
      senderId: sender._id,
      recipientId: recipient._id,
      content: args.content.trim(),
      imageUrl: args.imageUrl,
      isRead: false,
      createdAt: Date.now(),
      scheduledFor: args.scheduledFor,
      isScheduled: true,
    });

    return whisperId;
  },
});

// Get scheduled whispers for the current user
export const getScheduledWhispers = query({
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
      .query('whispers')
      .withIndex('by_scheduled', q => q.eq('isScheduled', true))
      .filter(q => 
        q.and(
          q.eq(q.field('senderId'), user._id),
          q.gt(q.field('scheduledFor'), Date.now())
        )
      )
      .order('asc')
      .collect();
  },
});

// Process scheduled whispers (would be called by a cron job)
export const processScheduledWhispers = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const dueWhispers = await ctx.db
      .query('whispers')
      .withIndex('by_scheduled', q => q.eq('isScheduled', true))
      .filter(q => q.lte(q.field('scheduledFor'), now))
      .collect();

    for (const whisper of dueWhispers) {
      await ctx.db.patch(whisper._id, {
        isScheduled: false,
        scheduledFor: undefined,
      });
    }

    return { processed: dueWhispers.length };
  },
});

// Cancel a scheduled whisper
export const cancelScheduledWhisper = mutation({
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

    if (whisper.senderId !== user._id) {
      throw new Error('Not authorized to cancel this whisper');
    }

    if (!whisper.isScheduled) {
      throw new Error('This whisper is not scheduled');
    }

    await ctx.db.delete(args.whisperId);

    return { success: true };
  },
});

// === ARCHIVING ===

// Archive a whisper
export const archiveWhisper = mutation({
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

    if (whisper.recipientId !== user._id && whisper.senderId !== user._id) {
      throw new Error('Not authorized to archive this whisper');
    }

    await ctx.db.patch(args.whisperId, { isArchived: true });

    return { success: true };
  },
});

// Unarchive a whisper
export const unarchiveWhisper = mutation({
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

    if (whisper.recipientId !== user._id && whisper.senderId !== user._id) {
      throw new Error('Not authorized to unarchive this whisper');
    }

    await ctx.db.patch(args.whisperId, { isArchived: false });

    return { success: true };
  },
});

// Get archived whispers
export const getArchivedWhispers = query({
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

    // OPTIMIZATION: Add .take() limits to prevent unbounded fetches
    const [received, sent] = await Promise.all([
      ctx.db
        .query('whispers')
        .withIndex('by_recipient', q => q.eq('recipientId', user._id))
        .filter(q => q.eq(q.field('isArchived'), true))
        .take(50),
      ctx.db
        .query('whispers')
        .withIndex('by_sender', q => q.eq('senderId', user._id))
        .filter(q => q.eq(q.field('isArchived'), true))
        .take(50),
    ]);

    return [...received, ...sent].sort((a, b) => b.createdAt - a.createdAt);
  },
});

// === TYPING INDICATORS ===

// Set typing status for a conversation between two users
export const setTypingStatus = mutation({
  args: {
    otherUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return;
    }

    // Get or create conversation
    const participantKey = [user._id, args.otherUserId].sort().join('-');
    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_participant_key', q => q.eq('participantKey', participantKey))
      .first();

    if (!conversation) {
      // No conversation yet, don't create typing indicator
      return;
    }

    // Check for existing indicator
    const existing = await ctx.db
      .query('typingIndicators')
      .withIndex('by_conversation', q => q.eq('conversationId', conversation._id))
      .filter(q => q.eq(q.field('userId'), user._id))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { lastTypingAt: now });
    } else {
      await ctx.db.insert('typingIndicators', {
        conversationId: conversation._id,
        userId: user._id,
        lastTypingAt: now,
      });
    }
  },
});

// Get typing status for a conversation
export const getTypingStatus = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { isTyping: false };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return { isTyping: false };
    }

    // Get typing indicators from last 5 seconds, excluding current user
    const fiveSecondsAgo = Date.now() - 5000;

    const typing = await ctx.db
      .query('typingIndicators')
      .withIndex('by_conversation', q => q.eq('conversationId', args.conversationId))
      .filter(q => 
        q.and(
          q.gt(q.field('lastTypingAt'), fiveSecondsAgo),
          q.neq(q.field('userId'), user._id)
        )
      )
      .first();

    return { isTyping: !!typing };
  },
});

