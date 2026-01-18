'use strict';

import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';

// ============================================================
// IN-APP NOTIFICATIONS
// ============================================================

// Get user's notifications with pagination
export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { notifications: [], unreadCount: 0 };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return { notifications: [], unreadCount: 0 };
    }

    const limit = args.limit || 20;

    // Get notifications
    let notificationsQuery = ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc');

    const notifications = await notificationsQuery.take(limit);

    // Filter if unreadOnly
    const filteredNotifications = args.unreadOnly
      ? notifications.filter((n) => !n.read)
      : notifications;

    // Get unread count
    const allNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    const unreadCount = allNotifications.filter((n) => !n.read).length;

    return {
      notifications: filteredNotifications,
      unreadCount,
    };
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return 0;
    }

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
      .collect();

    return notifications.length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== user._id) {
      throw new Error('Notification not found');
    }

    await ctx.db.patch(args.notificationId, { read: true });

    return { success: true };
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const unreadNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { read: true });
    }

    return { success: true, count: unreadNotifications.length };
  },
});

// Delete a notification
export const deleteNotification = mutation({
  args: {
    notificationId: v.id('notifications'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== user._id) {
      throw new Error('Notification not found');
    }

    await ctx.db.delete(args.notificationId);

    return { success: true };
  },
});

// Clear all notifications
export const clearAllNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    return { success: true, count: notifications.length };
  },
});

// Internal: Create a notification (called by other mutations)
export const createNotification = mutation({
  args: {
    userId: v.id('users'),
    type: v.union(
      v.literal('whisper'),
      v.literal('friend_request'),
      v.literal('chamber'),
      v.literal('resonance'),
      v.literal('system')
    ),
    title: v.string(),
    message: v.string(),
    actionUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      read: false,
      actionUrl: args.actionUrl,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

// Internal mutation: Create notification (for internal use by other modules)
export const createNotificationInternal = internalMutation({
  args: {
    userId: v.id('users'),
    type: v.union(
      v.literal('whisper'),
      v.literal('friend_request'),
      v.literal('friend_accepted'),
      v.literal('chamber'),
      v.literal('resonance'),
      v.literal('system')
    ),
    title: v.string(),
    message: v.string(),
    actionUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type === 'friend_accepted' ? 'friend_request' : args.type,
      title: args.title,
      message: args.message,
      read: false,
      actionUrl: args.actionUrl,
      metadata: args.metadata,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

// Internal mutation: Create or update aggregated chamber notification
export const createOrUpdateChamberNotification = internalMutation({
  args: {
    userId: v.id('users'),
    chamberId: v.id('echoChambers'),
    chamberName: v.string(),
    senderAlias: v.string(),
    messagePreview: v.string(),
    hasImage: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Find existing unread chamber notification for this chamber
    const existingNotifications = await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .filter((q) => 
        q.and(
          q.eq(q.field('type'), 'chamber'),
          q.eq(q.field('read'), false),
          q.eq(q.field('metadata.chamberId'), args.chamberId)
        )
      )
      .collect();

    const existingNotification = existingNotifications.find(
      (n) => n.metadata?.chamberId === args.chamberId
    );

    if (existingNotification) {
      // Update existing notification
      const currentCount = (existingNotification.metadata?.messageCount || 1) + 1;
      await ctx.db.patch(existingNotification._id, {
        title: args.chamberName,
        message: `${args.senderAlias}: ${args.messagePreview}`,
        metadata: {
          ...existingNotification.metadata,
          messageCount: currentCount,
          latestSenderAlias: args.senderAlias,
          hasImage: args.hasImage || existingNotification.metadata?.hasImage,
        },
        createdAt: Date.now(), // Update timestamp to bring to top
      });
      return existingNotification._id;
    } else {
      // Create new notification
      const notificationId = await ctx.db.insert('notifications', {
        userId: args.userId,
        type: 'chamber',
        title: args.chamberName,
        message: `${args.senderAlias}: ${args.messagePreview}`,
        read: false,
        actionUrl: `/chambers/${args.chamberId}`,
        metadata: {
          chamberId: args.chamberId,
          messageCount: 1,
          latestSenderAlias: args.senderAlias,
          hasImage: args.hasImage,
        },
        createdAt: Date.now(),
      });
      return notificationId;
    }
  },
});
