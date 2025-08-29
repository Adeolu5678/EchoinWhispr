import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Send a whisper to another user
export const sendWhisper = mutation({
  args: {
    recipientUsername: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate content length (max 280 characters as per SSD)
    if (args.content.length > 280) {
      throw new Error("Whisper content must be 280 characters or less");
    }

    if (args.content.trim().length === 0) {
      throw new Error("Whisper content cannot be empty");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get sender
    const sender = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!sender) {
      throw new Error("Sender not found");
    }

    // Get recipient
    const recipient = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.recipientUsername))
      .first();

    if (!recipient) {
      throw new Error("Recipient not found");
    }

    // Don't allow sending whispers to yourself
    if (sender._id === recipient._id) {
      throw new Error("Cannot send whisper to yourself");
    }

    const now = Date.now();

    // Create the whisper
    const whisperId = await ctx.db.insert("whispers", {
      senderId: sender._id,
      recipientId: recipient._id,
      content: args.content.trim(),
      isRead: false,
      createdAt: now,
    });

    return whisperId;
  },
});

// Get whispers received by current user
export const getReceivedWhispers = query({
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

    return await ctx.db
      .query("whispers")
      .withIndex("by_recipient", (q) => q.eq("recipientId", user._id))
      .order("desc")
      .collect();
  },
});

// Get whispers sent by current user
export const getSentWhispers = query({
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

    return await ctx.db
      .query("whispers")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .order("desc")
      .collect();
  },
});

// Mark whisper as read
export const markWhisperAsRead = mutation({
  args: {
    whisperId: v.id("whispers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get the whisper to verify ownership
    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error("Whisper not found");
    }

    // Only recipient can mark as read
    if (whisper.recipientId !== user._id) {
      throw new Error("Not authorized to mark this whisper as read");
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return 0;
    }

    const unreadWhispers = await ctx.db
      .query("whispers")
      .withIndex("by_recipient", (q) => q.eq("recipientId", user._id))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unreadWhispers.length;
  },
});