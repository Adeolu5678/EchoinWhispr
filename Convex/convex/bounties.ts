import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a bounty
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    reward: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    return await ctx.db.insert('bounties', {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      reward: args.reward,
      status: 'open',
      createdAt: Date.now(),
    });
  },
});

// List bounties for a project
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bounties')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Assign bounty
export const assign = mutation({
  args: {
    id: v.id('bounties'),
    assigneeId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    await ctx.db.patch(args.id, { 
      assigneeId: args.assigneeId,
      status: 'assigned'
    });
  },
});

// Complete bounty
export const complete = mutation({
  args: { id: v.id('bounties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    await ctx.db.patch(args.id, { status: 'completed' });
  },
});

// Claim a bounty (for talent)
export const claim = mutation({
  args: { id: v.id('bounties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    if (bounty.status !== 'open') {
      throw new Error('Bounty is not open');
    }

    await ctx.db.patch(args.id, { 
      assigneeId: user._id,
      status: 'assigned'
    });
  },
});

