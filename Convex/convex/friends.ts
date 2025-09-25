import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// TypeScript types for friends functionality
export type FriendStatus = "pending" | "accepted" | "blocked";

export interface FriendRequest {
  userId: Id<"users">;
  friendId: Id<"users">;
  status: FriendStatus;
  createdAt: number;
  updatedAt: number;
}

export interface FriendWithUser {
  _id: Id<"friends">;
  userId: Id<"users">;
  friendId: Id<"users">;
  status: FriendStatus;
  createdAt: number;
  updatedAt: number;
  friendUser: Doc<"users">;
}

// Send a friend request to another user
export const sendFriendRequest = mutation({
  args: {
    friendUsername: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate friend username
    if (!args.friendUsername || args.friendUsername.trim().length === 0) {
      throw new Error("Friend username cannot be empty");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Get target user by username
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.friendUsername.trim()))
      .first();

    if (!targetUser) {
      throw new Error("User not found");
    }

    // Don't allow sending friend requests to yourself
    if (currentUser._id === targetUser._id) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship1 = await ctx.db
      .query("friends")
      .withIndex("by_user_friend", (q) =>
        q.eq("userId", currentUser._id).eq("friendId", targetUser._id)
      )
      .first();

    const existingFriendship2 = await ctx.db
      .query("friends")
      .withIndex("by_user_friend", (q) =>
        q.eq("userId", targetUser._id).eq("friendId", currentUser._id)
      )
      .first();

    if (existingFriendship1 || existingFriendship2) {
      throw new Error("Friendship already exists");
    }

    const now = Date.now();

    // Create the friend request
    const friendshipId = await ctx.db.insert("friends", {
      userId: currentUser._id,
      friendId: targetUser._id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return friendshipId;
  },
});

// Accept a friend request
export const acceptFriendRequest = mutation({
  args: {
    friendshipId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Get the friendship
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Only the recipient can accept the friend request
    if (friendship.friendId !== currentUser._id) {
      throw new Error("Not authorized to accept this friend request");
    }

    // Only accept pending requests
    if (friendship.status !== "pending") {
      throw new Error("Friend request is not pending");
    }

    // Update the friendship status to accepted
    await ctx.db.patch(args.friendshipId, {
      status: "accepted",
      updatedAt: Date.now(),
    });

    return args.friendshipId;
  },
});

// Reject a friend request
export const rejectFriendRequest = mutation({
  args: {
    friendshipId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Get the friendship
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Only the recipient can reject the friend request
    if (friendship.friendId !== currentUser._id) {
      throw new Error("Not authorized to reject this friend request");
    }

    // Only reject pending requests
    if (friendship.status !== "pending") {
      throw new Error("Friend request is not pending");
    }

    // Remove the friendship entirely
    await ctx.db.delete(args.friendshipId);

    return args.friendshipId;
  },
});

// Remove a friend (unfriend)
export const removeFriend = mutation({
  args: {
    friendshipId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Get the friendship
    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friendship not found");
    }

    // Only participants can remove the friendship
    if (friendship.userId !== currentUser._id && friendship.friendId !== currentUser._id) {
      throw new Error("Not authorized to remove this friendship");
    }

    // Remove the friendship
    await ctx.db.delete(args.friendshipId);

    return args.friendshipId;
  },
});

// Get accepted friends list for current user
export const getFriendsList = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    // Get friendships where current user is userId and status is accepted
    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", currentUser._id).eq("status", "accepted")
      )
      .collect();

    // Get friendships where current user is friendId and status is accepted
    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_friend_status", (q) =>
        q.eq("friendId", currentUser._id).eq("status", "accepted")
      )
      .collect();

    // Combine and deduplicate friendships
    const allFriendships = [...friendships1, ...friendships2];

    // Get unique friend user IDs
    const friendIds = new Set<Id<"users">>();
    allFriendships.forEach(friendship => {
      if (friendship.userId === currentUser._id) {
        friendIds.add(friendship.friendId);
      } else {
        friendIds.add(friendship.userId);
      }
    });

    // Get friend user details
    const friends = await Promise.all(
      Array.from(friendIds).map(async (friendId) => {
        const friendUser = await ctx.db.get(friendId);
        return friendUser;
      })
    );

    return friends.filter(Boolean) as Doc<"users">[];
  },
});

// Get pending friend requests received by current user
export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    // Get pending requests where current user is the recipient
    const pendingRequests = await ctx.db
      .query("friends")
      .withIndex("by_friend_status", (q) =>
        q.eq("friendId", currentUser._id).eq("status", "pending")
      )
      .collect();

    // Get sender user details for each request
    const requestsWithUsers = await Promise.all(
      pendingRequests.map(async (request) => {
        const senderUser = await ctx.db.get(request.userId);
        return {
          ...request,
          senderUser,
        };
      })
    );

    return requestsWithUsers.filter(req => req.senderUser) as (Doc<"friends"> & { senderUser: Doc<"users"> })[];
  },
});

// Get sent friend requests by current user
export const getSentRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      return [];
    }

    // Get pending requests where current user is the sender
    const sentRequests = await ctx.db
      .query("friends")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", currentUser._id).eq("status", "pending")
      )
      .collect();

    // Get recipient user details for each request
    const requestsWithUsers = await Promise.all(
      sentRequests.map(async (request) => {
        const recipientUser = await ctx.db.get(request.friendId);
        return {
          ...request,
          recipientUser,
        };
      })
    );

    return requestsWithUsers.filter(req => req.recipientUser) as (Doc<"friends"> & { recipientUser: Doc<"users"> })[];
  },
});