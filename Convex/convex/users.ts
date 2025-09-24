import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get current user or create if doesn't exist
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user;
  },
});

// Create or update user from Clerk webhook
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
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

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Get or create current user (client-side fallback)
export const getOrCreateCurrentUser = mutation({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }

      // Validate required Clerk identity fields
      if (!identity.subject || !identity.email) {
        throw new Error("Invalid identity: missing required fields");
      }

      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (existingUser) {
        return existingUser;
      }

      // Generate unique username with better fallback
      let username = identity.nickname || identity.name || identity.email?.split("@")[0];
      if (!username) {
        username = `user_${identity.subject.slice(-8)}`;
      }

      // Ensure username uniqueness
      const existingUsername = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", username))
        .first();

      if (existingUsername) {
        username = `${username}_${Date.now()}`;
      }

      // Create new user from Clerk identity
      const now = Date.now();
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        username,
        email: identity.email,
        firstName: identity.givenName || undefined,
        lastName: identity.familyName || undefined,
        createdAt: now,
        updatedAt: now,
      });

      // Return the newly created user
      return await ctx.db.get(userId);
    } catch (error) {
      console.error("Error in getOrCreateCurrentUser:", error);
      throw error;
    }
  },
});