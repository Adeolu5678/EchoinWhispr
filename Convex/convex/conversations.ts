import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

/**
 * Echo a whisper by sending a reply and creating an active conversation.
 * This implements the direct echo-to-conversation mechanism, eliminating the complex request flow.
 * Creates a conversation with 'active' status and sends the initial reply message.
 */
export const echoWhisper = mutation({
  args: {
    whisperId: v.id('whispers'),
    replyContent: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    // Validate reply content length
    if (args.replyContent.length < 1 || args.replyContent.length > 1000) {
      throw new Error('Reply content must be between 1 and 1000 characters');
    }

    // Get the whisper
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) throw new Error('Whisper not found');

    // Verify user is the recipient of the whisper
    if (whisper.recipientId !== userId) {
      throw new Error('Not authorized to echo this whisper');
    }

    // Check if a conversation already exists for this whisper
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_initial_whisper', (q) => q.eq('initialWhisperId', args.whisperId))
      .first();

    if (existingConversation) {
      throw new Error('Conversation already exists for this whisper');
    }

    // Create participant key (sorted for uniqueness)
    const participants = [whisper.senderId, whisper.recipientId].sort();
    const participantKey = participants.join('-');

    // Create active conversation
    const conversationId = await ctx.db.insert('conversations', {
      participantIds: participants,
      participantKey,
      initialWhisperId: args.whisperId,
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create the initial whisper message (original message that started the conversation)
    await ctx.db.insert('messages', {
      conversationId,
      senderId: whisper.senderId,
      content: whisper.content,
      createdAt: Date.now() - 1, // Ensure it appears first
      imageUrl: whisper.imageUrl, // Include image attachment if present
    });

    // Create the initial reply message
    const messageId = await ctx.db.insert('messages', {
      conversationId,
      senderId: userId,
      content: args.replyContent.trim(),
      createdAt: Date.now(),
    });

    // Update whisper to link to conversation
    await ctx.db.patch(args.whisperId, {
      conversationId,
    });

    return { conversationId, messageId };
  },
});

/**
 * Send an echo request to initiate a conversation from a received whisper.
 * Creates a conversation with 'initiated' status.
 */
export const sendEchoRequest = mutation({
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
    const userId = user._id;

    // Get the whisper
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) throw new Error('Whisper not found');

    // Verify user is the recipient of the whisper
    if (whisper.recipientId !== userId) {
      throw new Error('Not authorized to send echo request for this whisper');
    }

    // Check if a conversation already exists for this whisper
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_initial_whisper', (q) => q.eq('initialWhisperId', args.whisperId))
      .first();

    if (existingConversation) {
      throw new Error('Echo request already sent for this whisper');
    }

    // Create participant key (sorted for uniqueness)
    const participants = [whisper.senderId, whisper.recipientId].sort();
    const participantKey = participants.join('-');

    // Create conversation
    const conversationId = await ctx.db.insert('conversations', {
      participantIds: participants,
      participantKey,
      initialWhisperId: args.whisperId,
      status: 'initiated',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

/**
 * Send an echo request to initiate a conversation from a received whisper.
 * Creates a conversation with 'initiated' status.
 */
/**
 * Send a message in a conversation.
 * Validates that the user is a participant in the conversation and the conversation is active.
 */
/**
 * Send a message in a conversation.
 * Validates that the user is a participant in the conversation and the conversation is active.
 */
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
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    // Validate content length
    if (args.content.length < 1 || args.content.length > 1000) {
      throw new Error('Message content must be between 1 and 1000 characters');
    }

    // Get conversation and verify user is participant
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (!conversation.participantIds.includes(userId)) {
      throw new Error('Not authorized to send messages in this conversation');
    }
    if (conversation.status !== 'active') {
      throw new Error('Conversation is not active');
    }

    // Create message
    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderId: userId,
      content: args.content.trim(),
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    // Update conversation updatedAt
    await ctx.db.patch(args.conversationId, {
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

/**
 * Get messages for a conversation.
 * Only participants can view messages.
 */
export const getMessages = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    // Verify user is participant
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (!conversation.participantIds.includes(userId)) {
      throw new Error('Not authorized to view this conversation');
    }

    // Get messages ordered by creation time
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', args.conversationId))
      .order('asc')
      .collect();

    return messages;
  },
});

/**
 * Accept an echo request (initiated conversation).
 * Changes conversation status from 'initiated' to 'active'.
 */
export const acceptEchoRequest = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (conversation.status !== 'initiated') {
      throw new Error('Conversation is not in initiated status');
    }

    // Verify user is the sender of the initial whisper (recipient of the echo request)
    const initialWhisper = await ctx.db.get(conversation.initialWhisperId);
    if (!initialWhisper) throw new Error('Initial whisper not found');
    if (initialWhisper.senderId !== userId) {
      throw new Error('Not authorized to accept this echo request');
    }

    await ctx.db.patch(args.conversationId, {
      status: 'active',
      updatedAt: Date.now(),
    });

    return args.conversationId;
  },
});

/**
 * Reject an echo request (initiated conversation).
 * Changes conversation status to 'closed'.
 */
export const rejectEchoRequest = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (conversation.status !== 'initiated') {
      throw new Error('Conversation is not in initiated status');
    }

    // Verify user is the sender of the initial whisper (recipient of the echo request)
    const initialWhisper = await ctx.db.get(conversation.initialWhisperId);
    if (!initialWhisper) throw new Error('Initial whisper not found');
    if (initialWhisper.senderId !== userId) {
      throw new Error('Not authorized to reject this echo request');
    }

    await ctx.db.patch(args.conversationId, {
      status: 'closed',
      updatedAt: Date.now(),
    });

    return args.conversationId;
  },
});

/**
 * Get echo requests for the current user.
 * Returns initiated conversations where the user is the sender of the initial whisper.
 * Optimized to batch whisper fetches and reduce N+1 queries.
 */
export const getEchoRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    // Get initiated conversations
    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_status', (q) => q.eq('status', 'initiated'))
      .collect();

    if (conversations.length === 0) return [];

    // Batch fetch all initial whispers to avoid N+1 queries
    const whisperIds = conversations.map(conv => conv.initialWhisperId);
    const whispers = await Promise.all(
      whisperIds.map(id => ctx.db.get(id))
    );

    // Filter conversations where user is the sender of the initial whisper
    const echoRequests = conversations.filter((conversation, index) => {
      const whisper = whispers[index];
      return whisper && whisper.senderId === userId;
    });

    return echoRequests;
  },
});

/**
 * Get a specific conversation with full details.
 * Only participants can view the conversation.
 */
export const getConversation = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (!conversation.participantIds.includes(userId)) {
      throw new Error('Not authorized to view this conversation');
    }

    return conversation;
  },
});

/**
 * Get active conversations for the current user.
 */
export const getActiveConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .collect();

    // Filter to only conversations where user is a participant
    return conversations.filter(conv => conv.participantIds.includes(userId));
  },
});

/**
 * Get initiated conversations for the current user.
 * Used for debugging/admin purposes.
 */
export const getInitiatedConversations = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) throw new Error('User not found');
    const userId = user._id;

    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_status', (q) => q.eq('status', 'initiated'))
      .collect();

    // Filter to only conversations where user is a participant
    return conversations.filter(conv => conv.participantIds.includes(userId));
  },
});