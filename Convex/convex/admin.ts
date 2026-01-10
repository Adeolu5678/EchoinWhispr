import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { isAdmin, isSuperAdmin, getAdminRole, AdminRole } from './adminAuth';
import { useQuery, usePaginatedQuery } from 'convex/react';
import { api } from './_generated/api';

/**
 * Admin module for EchoinWhispr.
 * Provides admin promotion system, whisper monitoring, and dashboard analytics.
 */

// ============================================================
// ADMIN STATUS QUERIES
// ============================================================

/**
 * Check if the current user has admin privileges.
 */
export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx): Promise<{ isAdmin: boolean; role: AdminRole | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { isAdmin: false, role: null };
    }

    const role = await getAdminRole(ctx, identity.subject);
    return { isAdmin: role !== null, role };
  },
});

/**
 * Get the current user's admin request status (if any).
 */
export const getMyAdminRequestStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      return null;
    }

    const request = await ctx.db
      .query('adminRequests')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .order('desc')
      .first();

    return request;
  },
});

// ============================================================
// ADMIN REQUEST SYSTEM (Option C: Both request and direct grant)
// ============================================================

/**
 * User submits a request to become an admin.
 */
export const requestAdminPromotion = mutation({
  args: {
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Validate reason
    if (args.reason.trim().length < 10) {
      throw new Error('Please provide a reason with at least 10 characters');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already an admin
    const existingRole = await ctx.db
      .query('adminRoles')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .first();

    if (existingRole) {
      throw new Error('You are already an admin');
    }

    // Check for existing pending request
    const existingRequest = await ctx.db
      .query('adminRequests')
      .withIndex('by_user_id', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .first();

    if (existingRequest) {
      throw new Error('You already have a pending admin request');
    }

    // Create the request
    const requestId = await ctx.db.insert('adminRequests', {
      userId: user._id,
      clerkId: identity.subject,
      reason: args.reason.trim(),
      status: 'pending',
      createdAt: Date.now(),
    });

    return { success: true, requestId };
  },
});

/**
 * Super Admin: Get all pending admin requests.
 */
export const getPendingAdminRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify super admin
    const isSuperAdminUser = await isSuperAdmin(ctx, identity.subject);
    if (!isSuperAdminUser) {
      return [];
    }

    const requests = await ctx.db
      .query('adminRequests')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .order('desc')
      .collect();

    // Enrich with user details
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        return {
          ...request,
          username: user?.username || 'Unknown',
          email: user?.email || 'Unknown',
          displayName: user?.displayName || user?.username || 'Unknown',
        };
      })
    );

    return enrichedRequests;
  },
});

/**
 * Super Admin: Approve an admin request.
 */
export const approveAdminRequest = mutation({
  args: {
    requestId: v.id('adminRequests'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify super admin
    const isSuperAdminUser = await isSuperAdmin(ctx, identity.subject);
    if (!isSuperAdminUser) {
      throw new Error('Unauthorized: Super admin access required');
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    const reviewerUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    const now = Date.now();

    // Update request status
    await ctx.db.patch(args.requestId, {
      status: 'approved',
      reviewedBy: reviewerUser?._id,
      reviewedAt: now,
    });

    // Create admin role
    await ctx.db.insert('adminRoles', {
      userId: request.userId,
      clerkId: request.clerkId,
      role: 'admin',
      grantedBy: reviewerUser?._id,
      createdAt: now,
    });

    return { success: true };
  },
});

/**
 * Super Admin: Reject an admin request.
 */
export const rejectAdminRequest = mutation({
  args: {
    requestId: v.id('adminRequests'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify super admin
    const isSuperAdminUser = await isSuperAdmin(ctx, identity.subject);
    if (!isSuperAdminUser) {
      throw new Error('Unauthorized: Super admin access required');
    }

    const request = await ctx.db.get(args.requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    const reviewerUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    await ctx.db.patch(args.requestId, {
      status: 'rejected',
      reviewedBy: reviewerUser?._id,
      reviewedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Super Admin: Directly grant admin role to a user by username.
 */
export const grantAdminRole = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify super admin
    const isSuperAdminUser = await isSuperAdmin(ctx, identity.subject);
    if (!isSuperAdminUser) {
      throw new Error('Unauthorized: Super admin access required');
    }

    const targetUser = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!targetUser) {
      throw new Error('User not found');
    }

    // Check if already admin
    const existingRole = await ctx.db
      .query('adminRoles')
      .withIndex('by_user_id', (q) => q.eq('userId', targetUser._id))
      .first();

    if (existingRole) {
      throw new Error('User is already an admin');
    }

    const granterUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .first();

    await ctx.db.insert('adminRoles', {
      userId: targetUser._id,
      clerkId: targetUser.clerkId,
      role: 'admin',
      grantedBy: granterUser?._id,
      createdAt: Date.now(),
    });

    return { success: true, userId: targetUser._id };
  },
});

/**
 * Super Admin: Revoke admin privileges from a user.
 */
export const revokeAdminRole = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify super admin
    const isSuperAdminUser = await isSuperAdmin(ctx, identity.subject);
    if (!isSuperAdminUser) {
      throw new Error('Unauthorized: Super admin access required');
    }

    const adminRole = await ctx.db
      .query('adminRoles')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first();

    if (!adminRole) {
      throw new Error('User is not an admin');
    }

    // Cannot revoke super_admin role
    if (adminRole.role === 'super_admin') {
      throw new Error('Cannot revoke super admin privileges');
    }

    await ctx.db.delete(adminRole._id);

    return { success: true };
  },
});

// ============================================================
// WHISPER MONITORING (Admin-only)
// ============================================================

/**
 * Admin: Get all whispers with sender/recipient details (paginated).
 */
/**
 * Admin: Get all whispers with sender/recipient details (paginated).
 */
export const getAllWhispers = query({
  args: {
    paginationOpts: v.any(),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Verify admin
    const isAdminUser = await isAdmin(ctx, identity.subject);
    if (!isAdminUser) throw new Error('Unauthorized');

    // Get whispers ordered by creation time (newest first)
    // Note: Search implementation would need a search index, skipping for now as per plan focus on pagination
    const result = await ctx.db
      .query('whispers')
      .order('desc')
      .paginate(args.paginationOpts);

    // Enrich with sender/recipient usernames
    const enrichedWhispers = await Promise.all(
      result.page.map(async (whisper) => {
        const sender = await ctx.db.get(whisper.senderId);
        const recipient = await ctx.db.get(whisper.recipientId);
        return {
          _id: whisper._id,
          content: whisper.content,
          createdAt: whisper.createdAt,
          isRead: whisper.isRead,
          readAt: whisper.readAt,
          senderUsername: sender?.username || 'Deleted User',
          recipientUsername: recipient?.username || 'Deleted User',
          senderId: whisper.senderId,
          recipientId: whisper.recipientId,
          isMystery: whisper.isMystery,
          isScheduled: whisper.isScheduled,
          hasAudio: !!whisper.audioStorageId,
        };
      })
    );

    return {
      ...result,
      page: enrichedWhispers,
    };
  },
});

/**
 * Admin: Get detailed whisper information including full sender/recipient profiles.
 */
export const getWhisperDetails = query({
  args: {
    whisperId: v.id('whispers'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    // Verify admin
    const isAdminUser = await isAdmin(ctx, identity.subject);
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required');
    }

    const whisper = await ctx.db.get(args.whisperId);
    if (!whisper) {
      throw new Error('Whisper not found');
    }

    const sender = await ctx.db.get(whisper.senderId);
    const recipient = await ctx.db.get(whisper.recipientId);

    return {
      whisper: {
        _id: whisper._id,
        content: whisper.content,
        createdAt: whisper.createdAt,
        isRead: whisper.isRead,
        readAt: whisper.readAt,
        isMystery: whisper.isMystery,
        isScheduled: whisper.isScheduled,
        scheduledFor: whisper.scheduledFor,
        reactions: whisper.reactions,
        hasAudio: !!whisper.audioStorageId,
        audioDuration: whisper.audioDuration,
      },
      sender: sender ? {
        _id: sender._id,
        username: sender.username,
        email: sender.email,
        displayName: sender.displayName,
        career: sender.career,
        createdAt: sender.createdAt,
        isDeleted: sender.isDeleted,
      } : null,
      recipient: recipient ? {
        _id: recipient._id,
        username: recipient.username,
        email: recipient.email,
        displayName: recipient.displayName,
        career: recipient.career,
        createdAt: recipient.createdAt,
        isDeleted: recipient.isDeleted,
      } : null,
    };
  },
});

// ============================================================
// ADMIN DASHBOARD ANALYTICS
// ============================================================

/**
 * Admin: Get dashboard statistics.
 */
export const getAdminDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Verify admin
    const isAdminUser = await isAdmin(ctx, identity.subject);
    if (!isAdminUser) {
      return null;
    }

    // Get total users count (excluding deleted)
    const allUsers = await ctx.db
      .query('users')
      .filter((q) => q.neq(q.field('isDeleted'), true))
      .collect();
    const totalUsers = allUsers.length;

    // Get total whispers count
    const allWhispers = await ctx.db.query('whispers').collect();
    const totalWhispers = allWhispers.length;

    // Get today's activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const todayWhispers = allWhispers.filter((w) => w.createdAt >= todayTimestamp);
    const whispersToday = todayWhispers.length;

    // Get pending admin requests
    const pendingRequests = await ctx.db
      .query('adminRequests')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();
    const pendingAdminRequests = pendingRequests.length;

    // Get total admins
    const adminRoles = await ctx.db.query('adminRoles').collect();
    const totalAdmins = adminRoles.length;

    // Get active conversations count
    const conversations = await ctx.db
      .query('conversations')
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();
    const activeConversations = conversations.length;

    return {
      totalUsers,
      totalWhispers,
      whispersToday,
      pendingAdminRequests,
      totalAdmins,
      activeConversations,
    };
  },
});

/**
 * Admin: Get list of all admins.
 */
export const getAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify admin
    const isAdminUser = await isAdmin(ctx, identity.subject);
    if (!isAdminUser) {
      return [];
    }

    const adminRoles = await ctx.db.query('adminRoles').collect();

    const adminsWithDetails = await Promise.all(
      adminRoles.map(async (adminRole) => {
        const user = await ctx.db.get(adminRole.userId);
        const grantedByUser = adminRole.grantedBy 
          ? await ctx.db.get(adminRole.grantedBy)
          : null;
        return {
          ...adminRole,
          username: user?.username || 'Unknown',
          email: user?.email || 'Unknown',
          displayName: user?.displayName || user?.username || 'Unknown',
          grantedByUsername: grantedByUser?.username || 'System',
        };
      })
    );

    return adminsWithDetails;
  },
});
