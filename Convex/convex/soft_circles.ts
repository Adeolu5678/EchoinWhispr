import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Express interest / Commit
export const commit = mutation({
  args: {
    projectId: v.id('projects'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Check if already committed
    const existing = await ctx.db
      .query('soft_circles')
      .withIndex('by_investor', (q) => q.eq('investorId', user._id))
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .first();

    if (existing) {
      throw new Error('Already committed to this project');
    }

    return await ctx.db.insert('soft_circles', {
      projectId: args.projectId,
      investorId: user._id,
      amount: args.amount,
      status: 'interested',
      createdAt: Date.now(),
    });
  },
});

// List soft circles for a project
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    // In a real app, we might want to fetch user details too.
    // For now, just return the raw records.
    return await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Update status (e.g. Investor confirms, or withdraws)
export const updateStatus = mutation({
  args: {
    id: v.id('soft_circles'),
    status: v.union(v.literal('interested'), v.literal('committed'), v.literal('withdrawn')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    // Add checks: only the investor or project owner should be able to update this.
    
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Get a single soft circle by ID (or list for project context)
// Actually the frontend calls api.soft_circles.get with { projectId }
// So it expects a list, but named 'get'? 
// Wait, the error said "Property 'get' does not exist".
// And the usage was: const commitments = useQuery(api.soft_circles.get, { projectId }) || [];
// So 'get' should actually be 'list' or I should rename 'list' to 'get' or alias it.
// 'list' already exists and takes projectId.
// I will add 'get' as an alias to 'list' to match frontend usage, or better, update frontend to use 'list'.
// But to fix the error quickly without changing frontend logic (if I want to keep it simple), I'll add 'get' which does the same as 'list'.
export const get = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

