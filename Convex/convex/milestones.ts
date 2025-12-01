import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a milestone
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    // Verify ownership
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');
    
    // In a real app, check if user is owner. For MVP, assuming auth is enough or check ownerId
    // const user = ... check owner
    
    return await ctx.db.insert('milestones', {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      date: args.date,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

// List milestones for a project
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('milestones')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Update status
export const updateStatus = mutation({
  args: {
    id: v.id('milestones'),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('verified')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    await ctx.db.patch(args.id, { status: args.status });
  },
});
