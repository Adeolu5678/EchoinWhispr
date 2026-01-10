import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Echo Chambers Module
 * 
 * Anonymous group messaging with shareable invite links.
 * Users join with anonymous aliases and can chat without revealing identities.
 */

// Color palette for anonymous aliases
const ALIAS_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8B500", "#00CED1", "#FF69B4", "#7FFF00", "#DC143C",
];

// Generate a unique invite code
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new Echo Chamber
export const createChamber = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    topic: v.string(),
    maxMembers: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
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

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let existing = await ctx.db
      .query("echoChambers")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
      .first();
    
    // Regenerate if collision (unlikely but possible)
    while (existing) {
      inviteCode = generateInviteCode();
      existing = await ctx.db
        .query("echoChambers")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .first();
    }

    const now = Date.now();

    // Create the chamber
    const chamberId = await ctx.db.insert("echoChambers", {
      name: args.name,
      description: args.description,
      topic: args.topic,
      creatorId: user._id,
      inviteCode,
      maxMembers: args.maxMembers || 50,
      isPublic: args.isPublic ?? false,
      memberCount: 1,
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as first member
    await ctx.db.insert("echoChamberMembers", {
      chamberId,
      userId: user._id,
      anonymousAlias: "Whisper #1",
      aliasColor: ALIAS_COLORS[0],
      role: "creator",
      joinedAt: now,
    });

    return {
      chamberId,
      inviteCode,
      inviteLink: `/chambers/join/${inviteCode}`,
    };
  },
});

// Join a chamber via invite code
export const joinChamber = mutation({
  args: {
    inviteCode: v.string(),
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

    // Find the chamber
    const chamber = await ctx.db
      .query("echoChambers")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .first();

    if (!chamber) {
      throw new Error("Echo Chamber not found. Check your invite code.");
    }

    // Check if already a member
    const existingMembership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", chamber._id).eq("userId", user._id)
      )
      .first();

    if (existingMembership) {
      return {
        chamberId: chamber._id,
        alreadyMember: true,
        anonymousAlias: existingMembership.anonymousAlias,
      };
    }

    // Check member limit
    const memberCount = chamber.memberCount || 0;
    if (memberCount >= chamber.maxMembers) {
      throw new Error("This Echo Chamber is full.");
    }

    // Get next member number (OPTIMIZATION: use memberCount field instead of fetching all)
    const memberNumber = (chamber.memberCount || 0) + 1;
    const colorIndex = memberNumber % ALIAS_COLORS.length;

    // Add as member
    await ctx.db.insert("echoChamberMembers", {
      chamberId: chamber._id,
      userId: user._id,
      anonymousAlias: `Whisper #${memberNumber}`,
      aliasColor: ALIAS_COLORS[colorIndex],
      role: "member",
      joinedAt: Date.now(),
    });

    // Update member count
    await ctx.db.patch(chamber._id, {
      memberCount: memberCount + 1,
      updatedAt: Date.now(),
    });

    return {
      chamberId: chamber._id,
      alreadyMember: false,
      anonymousAlias: `Whisper #${memberNumber}`,
    };
  },
});

// Leave a chamber
export const leaveChamber = mutation({
  args: {
    chamberId: v.id("echoChambers"),
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

    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      throw new Error("You are not a member of this chamber");
    }

    if (membership.role === "creator") {
      throw new Error("Creators cannot leave their chamber. Delete it instead.");
    }

    // Remove membership
    await ctx.db.delete(membership._id);

    // Update member count
    const chamber = await ctx.db.get(args.chamberId);
    if (chamber) {
      await ctx.db.patch(args.chamberId, {
        memberCount: Math.max(0, (chamber.memberCount || 1) - 1),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Send a message in a chamber
export const sendMessage = mutation({
  args: {
    chamberId: v.id("echoChambers"),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    audioStorageId: v.optional(v.id("_storage")),
    audioDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Validate content length
    if (!args.content.trim() && !args.imageUrl && !args.audioStorageId) {
      throw new Error("Message cannot be empty");
    }
    
    if (args.content.length > 2000) {
      throw new Error("Message content must be 2000 characters or less");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check membership
    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      throw new Error("You must be a member to send messages");
    }

    const messageId = await ctx.db.insert("echoChamberMessages", {
      chamberId: args.chamberId,
      senderId: user._id,
      anonymousAlias: membership.anonymousAlias,
      aliasColor: membership.aliasColor,
      content: args.content,
      createdAt: Date.now(),
      imageUrl: args.imageUrl,
      audioStorageId: args.audioStorageId,
      audioDuration: args.audioDuration,
    });

    // Update chamber's last activity
    await ctx.db.patch(args.chamberId, {
      updatedAt: Date.now(),
    });

    return { messageId };
  },
});

// Add reaction to a message
export const addReaction = mutation({
  args: {
    messageId: v.id("echoChamberMessages"),
    emoji: v.string(),
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

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Get user's alias for this chamber
    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", message.chamberId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      throw new Error("You must be a member to react");
    }

    const reactions = message.reactions || [];
    
    // Check if user already reacted with this emoji
    const existingIndex = reactions.findIndex(
      r => r.anonymousAlias === membership.anonymousAlias && r.emoji === args.emoji
    );

    if (existingIndex >= 0) {
      // Remove the reaction (toggle)
      reactions.splice(existingIndex, 1);
    } else {
      // Add the reaction
      reactions.push({
        anonymousAlias: membership.anonymousAlias,
        emoji: args.emoji,
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(args.messageId, { reactions });

    return { success: true };
  },
});

// Get messages for a chamber (paginated)
export const getMessages = query({
  args: {
    chamberId: v.id("echoChambers"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { messages: [], hasMore: false };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return { messages: [], hasMore: false };
    }

    // Verify membership
    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      return { messages: [], hasMore: false };
    }

    const limit = args.limit || 50;
    
    let messagesQuery = ctx.db
      .query("echoChamberMessages")
      .withIndex("by_created", (q) => q.eq("chamberId", args.chamberId));

    if (args.cursor !== undefined) {
      messagesQuery = messagesQuery.filter((q) => 
        q.lt(q.field("createdAt"), args.cursor!)
      );
    }

    const messages = await messagesQuery
      .order("desc")
      .take(limit + 1);

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, -1) : messages;

    // Mark which messages are from the current user
    const enrichedMessages = resultMessages.map(m => ({
      ...m,
      isOwnMessage: m.senderId === user._id,
    }));

    return {
      messages: enrichedMessages.reverse(), // Oldest first for display
      hasMore,
      nextCursor: hasMore ? resultMessages[resultMessages.length - 1].createdAt : undefined,
    };
  },
});

// Get chamber details
export const getChamber = query({
  args: {
    chamberId: v.id("echoChambers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const chamber = await ctx.db.get(args.chamberId);
    if (!chamber) {
      return null;
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    return {
      ...chamber,
      isMember: !!membership,
      userAlias: membership?.anonymousAlias,
      userRole: membership?.role,
      userColor: membership?.aliasColor,
    };
  },
});

// Get chamber by invite code (for join page preview)
export const getChamberByInviteCode = query({
  args: {
    inviteCode: v.string(),
  },
  handler: async (ctx, args) => {
    const chamber = await ctx.db
      .query("echoChambers")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", args.inviteCode.toUpperCase()))
      .first();

    if (!chamber) {
      return null;
    }

    // Return limited info for preview
    return {
      _id: chamber._id,
      name: chamber.name,
      description: chamber.description,
      topic: chamber.topic,
      memberCount: chamber.memberCount || 0,
      maxMembers: chamber.maxMembers,
    };
  },
});

// List public chambers
export const listPublicChambers = query({
  args: {
    topic: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("echoChambers")
      .withIndex("by_public", (q) => q.eq("isPublic", true));

    if (args.topic !== undefined) {
      query = ctx.db
        .query("echoChambers")
        .withIndex("by_topic", (q) => q.eq("topic", args.topic!))
        .filter((q) => q.eq(q.field("isPublic"), true));
    }

    const chambers = await query
      .order("desc")
      .take(args.limit || 20);

    return chambers;
  },
});

// Get user's chambers
export const getMyChambers = query({
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

    const memberships = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(100); // OPTIMIZATION: Limit to prevent unbounded fetch

    if (memberships.length === 0) return [];

    // OPTIMIZATION: Batch fetch all chambers upfront
    const chamberIds = memberships.map(m => m.chamberId);
    const chambers = await Promise.all(chamberIds.map(id => ctx.db.get(id)));

    // Build response from already-fetched data
    return memberships
      .map((m, index) => {
        const chamber = chambers[index];
        return chamber ? {
          ...chamber,
          userAlias: m.anonymousAlias,
          userRole: m.role,
          userColor: m.aliasColor,
        } : null;
      })
      .filter(Boolean);
  },
});

// Get member count (no identity reveal)
export const getMemberCount = query({
  args: {
    chamberId: v.id("echoChambers"),
  },
  handler: async (ctx, args) => {
    const chamber = await ctx.db.get(args.chamberId);
    return chamber?.memberCount || 0;
  },
});

// Set typing indicator for chamber
export const setTyping = mutation({
  args: {
    chamberId: v.id("echoChambers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return;
    }

    const membership = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    if (!membership) {
      return;
    }

    // Check for existing indicator (OPTIMIZATION: use composite index)
    const existing = await ctx.db
      .query("echoChamberTyping")
      .withIndex("by_chamber_user", (q) => 
        q.eq("chamberId", args.chamberId).eq("userId", user._id)
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { lastTypingAt: now });
    } else {
      await ctx.db.insert("echoChamberTyping", {
        chamberId: args.chamberId,
        userId: user._id,
        anonymousAlias: membership.anonymousAlias,
        lastTypingAt: now,
      });
    }
  },
});

// Get typing indicators for a chamber
export const getTypingIndicators = query({
  args: {
    chamberId: v.id("echoChambers"),
  },
  handler: async (ctx, args) => {
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

    const fiveSecondsAgo = Date.now() - 5000;
    
    const typing = await ctx.db
      .query("echoChamberTyping")
      .withIndex("by_chamber", (q) => q.eq("chamberId", args.chamberId))
      .filter((q) => 
        q.and(
          q.gt(q.field("lastTypingAt"), fiveSecondsAgo),
          q.neq(q.field("userId"), user._id)
        )
      )
      .collect();

    return typing.map(t => t.anonymousAlias);
  },
});

// Delete chamber (creator only)
export const deleteChamber = mutation({
  args: {
    chamberId: v.id("echoChambers"),
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

    const chamber = await ctx.db.get(args.chamberId);
    if (!chamber) {
      throw new Error("Chamber not found");
    }

    if (chamber.creatorId !== user._id) {
      throw new Error("Only the creator can delete this chamber");
    }

    // Delete all messages (OPTIMIZATION: parallel deletion)
    const messages = await ctx.db
      .query("echoChamberMessages")
      .withIndex("by_chamber", (q) => q.eq("chamberId", args.chamberId))
      .take(1000); // Safety limit
    
    await Promise.all(messages.map(message => ctx.db.delete(message._id)));

    // Delete all memberships (OPTIMIZATION: parallel deletion)
    const members = await ctx.db
      .query("echoChamberMembers")
      .withIndex("by_chamber", (q) => q.eq("chamberId", args.chamberId))
      .take(1000);
    
    await Promise.all(members.map(member => ctx.db.delete(member._id)));

    // Delete typing indicators (OPTIMIZATION: parallel deletion)
    const typing = await ctx.db
      .query("echoChamberTyping")
      .withIndex("by_chamber", (q) => q.eq("chamberId", args.chamberId))
      .take(100);
    
    await Promise.all(typing.map(t => ctx.db.delete(t._id)));

    // Delete the chamber
    await ctx.db.delete(args.chamberId);

    return { success: true };
  },
});
