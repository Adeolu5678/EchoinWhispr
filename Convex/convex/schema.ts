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
    // Added for future profile editing
    displayName: v.optional(v.string()),
    // Added for push notifications
    pushNotificationToken: v.optional(v.string()),
    // Subscription status
    subscriptionStatus: v.optional(v.union(v.literal('free'), v.literal('premium'))),
    // SSD Fields
    career: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    mood: v.optional(v.string()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    needsUsernameSelection: v.optional(v.boolean()),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_username', ['username'])
    .index('by_email', ['email'])
    .index('by_push_token', ['pushNotificationToken'])
    // Add indexes for search/filtering if needed, though full text search might be better for interests
    .index('by_career', ['career'])
    .index('by_mood', ['mood']),

  // Whispers table - core messaging functionality
  whispers: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    conversationId: v.optional(v.id('conversations')),
    // Deferred feature: IMAGE_UPLOADS - URL/ID of an attached image
    imageUrl: v.optional(v.string()),
    // Deferred feature: LOCATION_BASED_FEATURES - User's location coordinates (with explicit opt-in)
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number()
    })),
    // Deferred feature: WHISPER_CHAINS - Chain-related fields
    chainId: v.optional(v.id('whispers')),
    parentWhisperId: v.optional(v.id('whispers')),
    chainOrder: v.optional(v.number()),
    isChainStart: v.optional(v.boolean()),
    // Deferred feature: MYSTERY_WHISPERS - Mystery whisper flag
    isMystery: v.optional(v.boolean()),
  })
    .index('by_sender', ['senderId'])
    .index('by_recipient', ['recipientId'])
    .index('by_sender_recipient', ['senderId', 'recipientId'])
    .index('by_created_at', ['createdAt'])
    .index('by_chain', ['chainId'])
    .index('by_parent', ['parentWhisperId']),

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
    .index("by_status", ["status"])
    .index("by_participants", ["participantIds"]),

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

  // Messages table - messages within conversations
  messages: defineTable({
    conversationId: v.id('conversations'),
    senderId: v.id('users'),
    content: v.string(),
    createdAt: v.number(),
    // Deferred feature: IMAGE_UPLOADS - URL/ID of an attached image
    imageUrl: v.optional(v.string()),
  })
    .index('by_conversation', ['conversationId'])
    .index('by_sender', ['senderId']),

  // Mystery Settings table - user preferences for mystery whispers
  mysterySettings: defineTable({
    userId: v.id('users'),
    optOut: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_id', ['userId']),

  // Mystery Whispers Daily Limits table - track daily usage
  mysteryWhisperLimits: defineTable({
    userId: v.id('users'),
    date: v.string(), // YYYY-MM-DD format
    count: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_date', ['userId', 'date']),

  // Feature Flags table - remote configuration
  featureFlags: defineTable({
    name: v.string(),
    enabled: v.boolean(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name']),

  // Subscriptions table - manage user subscriptions
  subscriptions: defineTable({
    userId: v.id('users'),
    planId: v.string(), // e.g., 'monthly_premium', 'yearly_premium'
    status: v.union(v.literal('active'), v.literal('canceled'), v.literal('expired')),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_status', ['status']),
});
