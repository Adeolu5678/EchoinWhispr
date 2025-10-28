import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

/**
 * Safe user projection type to prevent data leakage.
 * Only includes non-sensitive fields required for friend operations.
 */
type SafeUser = {
  _id: Id<'users'>;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

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
        if (!user) return null;
        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_user_id', q => q.eq('userId', friendId))
          .first();
        const safeUser: SafeUser = {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: profile?.avatarUrl,
        };
        return safeUser;
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
        if (!sender) return null;
        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_user_id', q => q.eq('userId', request.userId))
          .first();
        const safeSender: SafeUser = {
          _id: sender._id,
          username: sender.username,
          email: sender.email,
          firstName: sender.firstName,
          lastName: sender.lastName,
          avatarUrl: profile?.avatarUrl,
        };
        return {
          ...request,
          sender: safeSender,
          friendshipId: request._id,
        };
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
        if (!recipient) return null;
        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_user_id', q => q.eq('userId', request.friendId))
          .first();
        const safeRecipient: SafeUser = {
          _id: recipient._id,
          username: recipient.username,
          email: recipient.email,
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          avatarUrl: profile?.avatarUrl,
        };
        return {
          ...request,
          recipient: safeRecipient,
          friendshipId: request._id,
        };
      })
    );

    return requestsWithRecipients.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );
  },
});

export const checkFriendship = query({
  args: {
    userId: v.id('users'),
    friendUsername: v.string(),
  },
  handler: async (ctx, args) => {
    // Get friend by username
    const friend = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.friendUsername))
      .first();

    if (!friend) {
      return { isFriend: false, friendId: null };
    }

    // Check if friendship exists (both directions)
    const friendship1 = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', args.userId).eq('friendId', friend._id)
      )
      .first();

    const friendship2 = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', friend._id).eq('friendId', args.userId)
      )
      .first();

    const friendship = friendship1 || friendship2;

    return {
      isFriend: friendship?.status === 'accepted',
      friendId: friend._id,
      friendshipId: friendship?._id || null,
    };
  },
});

export const sendFriendWhisper = mutation({
  args: {
    recipientUsername: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    heading: v.optional(v.string()),
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

    // Get recipient by username
    const recipient = await ctx.db
      .query('users')
      .withIndex('by_username', q => q.eq('username', args.recipientUsername))
      .first();

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    // Check if they are friends
    const friendship1 = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', user._id).eq('friendId', recipient._id)
      )
      .first();

    const friendship2 = await ctx.db
      .query('friends')
      .withIndex('by_user_friend', q =>
        q.eq('userId', recipient._id).eq('friendId', user._id)
      )
      .first();

    const friendship = friendship1 || friendship2;

    if (!friendship || friendship.status !== 'accepted') {
      throw new Error('You can only send whispers to friends');
    }

    // Create the friend whisper
    const whisperId = await ctx.db.insert('friendWhispers', {
      senderId: user._id,
      recipientId: recipient._id,
      content: args.content,
      imageUrl: args.imageUrl,
      heading: args.heading,
      isRead: false,
      createdAt: Date.now(),
      readAt: undefined,
    });

    return whisperId;
  },
});

export const getSentFriendWhispers = query({
  handler: async (ctx) => {
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

    const whispers = await ctx.db
      .query('friendWhispers')
      .withIndex('by_sender', q => q.eq('senderId', user._id))
      .collect();

    // Get recipient details for each whisper
    const whispersWithRecipients = await Promise.all(
      whispers.map(async (whisper) => {
        const recipient = await ctx.db.get(whisper.recipientId);
        if (!recipient) return null;

        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_user_id', q => q.eq('userId', whisper.recipientId))
          .first();

        return {
          ...whisper,
          recipient: {
            _id: recipient._id,
            username: recipient.username,
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            avatarUrl: profile?.avatarUrl,
          },
        };
      })
    );

    return whispersWithRecipients.filter(
      (w): w is NonNullable<typeof w> => w !== null
    );
  },
});

export const getReceivedFriendWhispers = query({
  handler: async (ctx) => {
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

    const whispers = await ctx.db
      .query('friendWhispers')
      .withIndex('by_recipient', q => q.eq('recipientId', user._id))
      .collect();

    // Get sender details for each whisper
    const whispersWithSenders = await Promise.all(
      whispers.map(async (whisper) => {
        const sender = await ctx.db.get(whisper.senderId);
        if (!sender) return null;

        const profile = await ctx.db
          .query('profiles')
          .withIndex('by_user_id', q => q.eq('userId', whisper.senderId))
          .first();

        return {
          ...whisper,
          sender: {
            _id: sender._id,
            username: sender.username,
            firstName: sender.firstName,
            lastName: sender.lastName,
            avatarUrl: profile?.avatarUrl,
          },
        };
      })
    );

    return whispersWithSenders.filter(
      (w): w is NonNullable<typeof w> => w !== null
    );
  },
});
