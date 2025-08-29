import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  // Whispers table - core messaging functionality
  whispers: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    content: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"])
    .index("by_sender_recipient", ["senderId", "recipientId"])
    .index("by_created_at", ["createdAt"]),

  // User profiles table - additional user information
  profiles: defineTable({
    userId: v.id("users"),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_is_public", ["isPublic"]),
});