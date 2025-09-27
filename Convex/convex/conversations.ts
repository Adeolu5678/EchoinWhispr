import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Send an echo request to initiate conversation evolution.
 * Recipients can send echo requests from whisper cards with optional message (max 280 chars).
 * Creates a conversation record with status 'pending'.
 */
export const sendEchoRequest = mutation({
  args: {
    whisperId: v.id("whispers"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User must be authenticated");
    }

    // Validate message length if provided
    if (args.message && args.message.length > 280) {
      throw new Error("Message must be 280 characters or less");
    }

    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the whisper to ensure it exists and user is the recipient
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error("Whisper not found");
    }

    if (whisper.recipientId !== user._id) {
      throw new Error("Unauthorized: Only the recipient can send echo requests");
    }

    // Check if echo request already exists for this whisper
    const existingRequest = await ctx.db
      .query("conversations")
      .withIndex("by_whisper", (q) => q.eq("whisperId", args.whisperId))
      .first();

    if (existingRequest) {
      throw new Error("Echo request already exists for this whisper");
    }

    // Create the echo request
    const conversationId = await ctx.db.insert("conversations", {
      senderId: whisper.recipientId, // The recipient becomes the sender of the echo
      recipientId: whisper.senderId, // The original sender becomes the recipient
      whisperId: args.whisperId,
      status: "pending",
      message: args.message || undefined,
      createdAt: Date.now(),
    });

    return conversationId;
  },
});

/**
 * Accept an echo request to reveal identities and start conversation.
 * Senders can accept echo requests, which sets status to 'accepted' and records acceptedAt.
 */
export const acceptEchoRequest = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User must be authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Only the recipient (original whisper sender) can accept
    if (conversation.recipientId !== user._id) {
      throw new Error("Unauthorized: Only the recipient can accept echo requests");
    }

    // Must be pending
    if (conversation.status !== "pending") {
      throw new Error("Echo request is not pending");
    }

    // Update to accepted
    await ctx.db.patch(args.conversationId, {
      status: "accepted",
      acceptedAt: Date.now(),
    });

    return args.conversationId;
  },
});

/**
 * Reject an echo request to decline conversation evolution.
 * Senders can reject echo requests, which sets status to 'rejected'.
 */
export const rejectEchoRequest = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: User must be authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Only the recipient (original whisper sender) can reject
    if (conversation.recipientId !== user._id) {
      throw new Error("Unauthorized: Only the recipient can reject echo requests");
    }

    // Must be pending
    if (conversation.status !== "pending") {
      throw new Error("Echo request is not pending");
    }

    // Update to rejected
    await ctx.db.patch(args.conversationId, {
      status: "rejected",
    });

    return args.conversationId;
  },
});

/**
 * Get pending echo requests for the current user.
 * Returns echo requests where the user is the recipient (original whisper sender).
 */
export const getEchoRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get pending echo requests where user is the recipient
    const requests = await ctx.db
      .query("conversations")
      .withIndex("by_recipient_status", (q) =>
        q.eq("recipientId", user._id).eq("status", "pending")
      )
      .collect();

    return requests;
  },
});

/**
 * Get accepted conversations for the current user.
 * Returns conversations where the user is a participant and status is 'accepted'.
 */
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get accepted conversations where user is sender or recipient
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_sender_status", (q) =>
        q.eq("senderId", user._id).eq("status", "accepted")
      )
      .collect();

    const conversationsAsRecipient = await ctx.db
      .query("conversations")
      .withIndex("by_recipient_status", (q) =>
        q.eq("recipientId", user._id).eq("status", "accepted")
      )
      .collect();

    return [...conversations, ...conversationsAsRecipient];
  },
});