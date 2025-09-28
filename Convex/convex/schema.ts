import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table - synced with Clerk
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    needsUsernameSelection: v.optional(v.boolean()),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_username', ['username'])
    .index('by_email', ['email']),

  // Whispers table - core messaging functionality
  whispers: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    conversationId: v.optional(v.id('conversations')),
  })
    .index('by_sender', ['senderId'])
    .index('by_recipient', ['recipientId'])
    .index('by_sender_recipient', ['senderId', 'recipientId'])
    .index('by_created_at', ['createdAt']),

  // Conversations table - deferred feature for conversation evolution
  conversations: defineTable({
    participantIds: v.array(v.id("users")),
    participantKey: v.string(),
    initialWhisperId: v.id("whispers"),
    status: v.union(v.literal("initiated"), v.literal("active"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_participant_key", ["participantKey"])
    .index("by_initial_whisper", ["initialWhisperId"])
    .index("by_status", ["status"]),

  // User profiles table - additional user information
  profiles: defineTable({
    userId: v.id('users'),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_is_public', ['isPublic']),

  // Friends table - friendship relationships between users
  friends: defineTable({
    userId: v.id('users'),
    friendId: v.id('users'),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('blocked')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    message: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_friend_id', ['friendId'])
    .index('by_user_friend', ['userId', 'friendId'])
    .index('by_status', ['status'])
    .index('by_user_status', ['userId', 'status'])
    .index('by_friend_status', ['friendId', 'status']),
});
