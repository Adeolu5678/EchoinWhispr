import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

/**
 * Send a friend request to another user.
 * Validates that the user is not sending a request to themselves,
 * that no existing friendship exists, and that no pending request exists.
 */
export const sendFriendRequest = mutation({
  args: {
    friendId: v.id('users'),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be authenticated');
    }

    // Get the user
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if friend exists
    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      throw new Error('Friend not found');
    }

    // Prevent self-friending
    if (user._id === args.friendId) {
      throw new Error('Cannot send friend request to yourself');
    }

    // Check if friendship already exists
    const existingFriendship = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', user._id).eq('friendId', args.friendId)
      )
      .first();

    if (existingFriendship) {
      throw new Error('Friendship already exists or request pending');
    }

    // Check reverse relationship
    const reverseFriendship = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', args.friendId).eq('friendId', user._id)
      )
      .first();

    if (reverseFriendship) {
      throw new Error('Friendship already exists or request pending');
    }

    // Create friend request
    await ctx.db.insert('friends', {
      userId: user._id,
      friendId: args.friendId,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...(args.message && { message: args.message }),
    });
  },
});

/**
 * Accept an incoming friend request.
 * Only the recipient can accept their own requests.
 */
export const acceptFriendRequest = mutation({
  args: {
    requestId: v.id('friends'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Get the conversation
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }

    // Only the recipient can accept
    if (request.friendId !== user._id) {
      throw new Error(
        'Unauthorized: Only the recipient can accept friend requests'
      );
    }

    // Must be pending
    if (request.status !== 'pending') {
      throw new Error('Friend request is not pending');
    }

    // Update to accepted
    await ctx.db.patch(args.requestId, {
      status: 'accepted',
      updatedAt: Date.now(),
    });
  },
});

/**
 * Reject an incoming friend request.
 * Only the recipient can reject their own requests.
 */
export const rejectFriendRequest = mutation({
  args: {
    requestId: v.id('friends'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Get the conversation
    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Friend request not found');
    }

    // Only the recipient can reject
    if (request.friendId !== user._id) {
      throw new Error(
        'Unauthorized: Only the recipient can reject friend requests'
      );
    }

    // Must be pending
    if (request.status !== 'pending') {
      throw new Error('Friend request is not pending');
    }

    // Delete the request
    await ctx.db.delete(args.requestId);
  },
});

/**
 * Remove a friend or cancel a sent request.
 * Users can remove friends or cancel their own sent requests.
 */
export const removeFriend = mutation({
  args: {
    friendshipId: v.id('friends'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized: User must be authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) throw new Error('Friendship not found');

    // Ensure user is part of the friendship
    if (friendship.userId !== user._id && friendship.friendId !== user._id) {
      throw new Error('Unauthorized to modify this friendship');
    }

    // Delete the friendship
    await ctx.db.delete(args.friendshipId);
  },
});

/**
 * Get the user's friends list (accepted friendships).
 * Returns both directions of friendships.
 */
export const getFriendsList = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get friendships where user is the sender and status is accepted
    const sentFriends = await ctx.db
      .query('friends')
      .withIndex('by_user_status', q =>
        q.eq('userId', user._id).eq('status', 'accepted')
      )
      .collect();

    // Get friendships where user is the recipient and status is accepted
    const receivedFriends = await ctx.db
      .query('friends')
      .withIndex('by_friend_status', q =>
        q.eq('friendId', user._id).eq('status', 'accepted')
      )
      .collect();

    // Combine and get user details
    const friendIds = [
      ...sentFriends.map(f => f.friendId),
      ...receivedFriends.map(f => f.userId),
    ];

    const friends = await Promise.all(
      friendIds.map(async friendId => {
        const user = await ctx.db.get(friendId);
        return user ? { ...user, friendshipId: '' } : null; // Will be set below
      })
    );

    // Add friendship IDs for removal
    const friendsWithIds = friends
      .filter((f): f is NonNullable<typeof f> => f !== null)
      .map(friend => {
        const friendship = [...sentFriends, ...receivedFriends].find(
          f => f.userId === friend._id || f.friendId === friend._id
        );
        return {
          ...friend,
          friendshipId: friendship?._id || '',
        };
      });

    return friendsWithIds;
  },
});

/**
 * Get pending friend requests sent to the user.
 */
export const getPendingRequests = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get pending friend requests where user is the recipient
    const requests = await ctx.db
      .query('friends')
      .withIndex('by_friend_status', q =>
        q.eq('friendId', user._id).eq('status', 'pending')
      )
      .collect();

    // Get sender details
    const requestsWithSenders = await Promise.all(
      requests.map(async request => {
        const sender = await ctx.db.get(request.userId);
        return sender ? { ...request, sender } : null;
      })
    );

    return requestsWithSenders.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );
  },
});

/**
 * Get friend requests sent by the user that are still pending.
 */
export const getSentRequests = query({
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return [];
    }

    // Get pending friend requests where user is the sender
    const requests = await ctx.db
      .query('friends')
      .withIndex('by_user_status', q =>
        q.eq('userId', user._id).eq('status', 'pending')
      )
      .collect();

    // Get recipient details
    const requestsWithRecipients = await Promise.all(
      requests.map(async request => {
        const recipient = await ctx.db.get(request.friendId);
        return recipient ? { ...request, recipient } : null;
      })
    );

    return requestsWithRecipients.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );
  },
});
