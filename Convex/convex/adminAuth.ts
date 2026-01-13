import { QueryCtx, MutationCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

/**
 * Admin authorization utilities for Convex.
 * Provides role-based access control for admin operations.
 */

export type AdminRole = 'admin' | 'super_admin';

/**
 * Check if a user has admin privileges.
 * Returns the admin role if found, null otherwise.
 */
export async function getAdminRole(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
): Promise<AdminRole | null> {
  const adminRole = await ctx.db
    .query('adminRoles')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .first();

  return adminRole?.role ?? null;
}

/**
 * Check if a user is an admin (either admin or super_admin).
 */
export async function isAdmin(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
): Promise<boolean> {
  const role = await getAdminRole(ctx, clerkId);
  return role !== null;
}

/**
 * Check if a user is a super admin.
 */
export async function isSuperAdmin(
  ctx: QueryCtx | MutationCtx,
  clerkId: string
): Promise<boolean> {
  const role = await getAdminRole(ctx, clerkId);
  return role === 'super_admin';
}

/**
 * Enforce admin access - throws if user is not an admin.
 */
export async function enforceAdmin(
  ctx: MutationCtx,
  clerkId: string
): Promise<void> {
  const isUserAdmin = await isAdmin(ctx, clerkId);
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Enforce super admin access - throws if user is not a super admin.
 */
export async function enforceSuperAdmin(
  ctx: MutationCtx,
  clerkId: string
): Promise<void> {
  const isUserSuperAdmin = await isSuperAdmin(ctx, clerkId);
  if (!isUserSuperAdmin) {
    throw new Error('Unauthorized: Super admin access required');
  }
}

/**
 * Get current user's admin status from auth context.
 */
export async function getCurrentUserAdminStatus(
  ctx: QueryCtx | MutationCtx
): Promise<{ isAdmin: boolean; role: AdminRole | null }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return { isAdmin: false, role: null };
  }

  const role = await getAdminRole(ctx, identity.subject);
  return { isAdmin: role !== null, role };
}

/**
 * Enforce admin access for queries - throws if user is not an admin.
 * Unlike enforceAdmin, this works with QueryCtx.
 */
export async function enforceAdminQuery(
  ctx: QueryCtx,
  clerkId: string
): Promise<void> {
  const isUserAdmin = await isAdmin(ctx, clerkId);
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Enforce super admin access for queries - throws if user is not a super admin.
 */
export async function enforceSuperAdminQuery(
  ctx: QueryCtx,
  clerkId: string
): Promise<void> {
  const isUserSuperAdmin = await isSuperAdmin(ctx, clerkId);
  if (!isUserSuperAdmin) {
    throw new Error('Unauthorized: Super admin access required');
  }
}
