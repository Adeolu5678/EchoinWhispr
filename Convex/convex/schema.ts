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
    // Deferred feature: CAREER_FOCUSED_USER_SEARCH_AND_WHISPERS - Optional career search enabled
    careerSearchEnabled: v.optional(v.boolean()),
    // Deferred feature: PERSONA_PROFILES_VERIFICATION - Optional persona fields
    career: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    expertise: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    attestationId: v.optional(v.string()),
    // Deferred feature: INTEREST_BASED_ANONYMOUS_MATCHING - Optional interests field
    interests: v.optional(v.array(v.string())),
    // Deferred feature: RANDOM_ANONYMOUS_MESSAGING - Optional random message count
    randomMessageCount: v.optional(v.number()),
    // Deferred feature: SUBSCRIPTION_MODEL_ENHANCED_ACCESS - Optional subscription fields
    subscriptionTier: v.optional(v.string()),
    subscriptionExpiresAt: v.optional(v.number()),
    unlimitedMessages: v.optional(v.boolean()),
    unlimitedMatches: v.optional(v.boolean()),
    // Deferred feature: HEDERA_BASED_DECENTRALIZED_IDENTITY_VERIFICATION - Optional DID fields
    didId: v.optional(v.string()),
    didDocument: v.optional(v.string()),
    verificationStatus: v.optional(v.string()),
    communityMemberships: v.optional(v.array(v.string())),
    // Deferred feature: TOKENIZED_WHISPER_REWARDS_AND_TIPPING - Optional token fields
    tokenBalance: v.optional(v.number()),
    earnedTokens: v.optional(v.number()),
    // Deferred feature: MOOD_BASED_RANDOM_CONNECTIONS - Optional mood field
    mood: v.optional(v.string()),
    // Romance swiping fields
    bio: v.optional(v.string()),
    humor: v.optional(v.string()),
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
    // Deferred feature: AI_GENERATED_WHISPER_HEADINGS - Optional AI-generated heading
    heading: v.optional(v.string()),
    // Deferred feature: IMMUTABLE_WHISPER_TIMESTAMPING_VIA_CONSENSUS_SERVICE - Optional consensus fields
    consensusTimestamp: v.optional(v.string()),
    consensusHash: v.optional(v.string()),
    consensusTopicId: v.optional(v.string()),
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

  // Mood Connections Daily Limits table - track daily mood-based connection usage
  moodConnectionLimits: defineTable({
    userId: v.id('users'),
    date: v.string(), // YYYY-MM-DD format
    count: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index('by_user_date', ['userId', 'date']),

  // Matches table - deferred feature for interest-based anonymous matching
  matches: defineTable({
    userId: v.id('users'),
    matchedUserId: v.id('users'),
    interests: v.array(v.string()),
    status: v.string(),
    createdAt: v.number(),
    // Deferred feature: MUTUAL_MATCHING_SYSTEM - Mutual confirmation fields
    user1Interest: v.optional(v.boolean()),
    user2Interest: v.optional(v.boolean()),
    matchStatus: v.optional(v.union(v.literal('pending'), v.literal('matched'), v.literal('declined'), v.literal('seen'))),
    matchedAt: v.optional(v.number()),
  })
    .index('by_user_id', ['userId'])
    .index('by_matched_user_id', ['matchedUserId'])
    .index('by_status', ['status'])
    .index('by_match_status', ['matchStatus']),

  // Random Messages table - deferred feature for random anonymous messaging
  randomMessages: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    content: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_sender', ['senderId'])
    .index('by_recipient', ['recipientId'])
    .index('by_status', ['status'])
    .index('by_created_at', ['createdAt']),

  // Career Whispers table - deferred feature for career-focused whispers
  careerWhispers: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    career: v.string(),
    content: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_sender', ['senderId'])
    .index('by_recipient', ['recipientId'])
    .index('by_career', ['career'])
    .index('by_status', ['status'])
    .index('by_created_at', ['createdAt']),

  // Token Transactions table - deferred feature for tokenized rewards and tipping
  tokenTransactions: defineTable({
    userId: v.id('users'),
    transactionType: v.string(),
    amount: v.number(),
    recipientId: v.optional(v.id('users')),
    whisperId: v.optional(v.id('whispers')),
    createdAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_recipient_id', ['recipientId'])
    .index('by_whisper_id', ['whisperId'])
    .index('by_created_at', ['createdAt']),
  // Governance Proposals table - deferred feature for Hedera-powered anonymous community governance
  governanceProposals: defineTable({
    title: v.string(),
    description: v.string(),
    proposerId: v.id('users'),
    status: v.string(),
    votesFor: v.number(),
    votesAgainst: v.number(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
  .index('by_proposer', ['proposerId'])
  .index('by_status', ['status'])
  .index('by_created_at', ['createdAt'])
  .index('by_expires_at', ['expiresAt']),

  // Mood Connections table - deferred feature for mood-based random connections
  moodConnections: defineTable({
    userId: v.id('users'),
    matchedUserId: v.id('users'),
    mood: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_matched_user_id', ['matchedUserId'])
    .index('by_mood', ['mood'])
    .index('by_status', ['status'])
    .index('by_created_at', ['createdAt']),

  // Swipe History table - record romance swipe actions
  swipeHistory: defineTable({
    swiperId: v.id('users'),
    swipedUserId: v.id('users'),
    action: v.union(v.literal('like'), v.literal('dislike')),
    createdAt: v.number(),
  })
    .index('by_swiper', ['swiperId'])
    .index('by_swiped_user', ['swipedUserId'])
    .index('by_created_at', ['createdAt']),

  // Usage Limits table - unified daily usage tracking for all features
  usageLimits: defineTable({
    userId: v.id('users'),
    feature: v.union(
      v.literal('mood_matches'),
      v.literal('romance_swipes'),
      v.literal('random_messages')
    ),
    date: v.string(), // YYYY-MM-DD format
    count: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index('by_user_feature_date', ['userId', 'feature', 'date'])
  .index('by_user_date', ['userId', 'date']),

  // Friend Whispers table - deferred feature for enhanced friend whispering
  friendWhispers: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    // Deferred feature: IMAGE_UPLOADS - URL/ID of an attached image
    imageUrl: v.optional(v.string()),
    // Deferred feature: AI_GENERATED_WHISPER_HEADINGS - Optional AI-generated heading
    heading: v.optional(v.string()),
    // Deferred feature: IMMUTABLE_WHISPER_TIMESTAMPING_VIA_CONSENSUS_SERVICE - Optional consensus fields
    consensusTimestamp: v.optional(v.string()),
    consensusHash: v.optional(v.string()),
    consensusTopicId: v.optional(v.string()),
  })
  .index('by_sender', ['senderId'])
  .index('by_recipient', ['recipientId'])
  .index('by_sender_recipient', ['senderId', 'recipientId'])
  .index('by_created_at', ['createdAt']),
});
