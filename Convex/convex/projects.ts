import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a new project and its associated workspace
export const create = mutation({
  args: {
    title: v.string(),
    tagline: v.string(),
    description: v.string(),
    industry: v.string(),
    fundingGoal: v.number(),
    equityOffered: v.number(),
    logoUrl: v.optional(v.string()),
    pitchDeckUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called create project without authentication present');
    }

    // Get the user from the database to verify role (optional for now, but good practice)
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Create the project
    const projectId = await ctx.db.insert('projects', {
      ownerId: user._id,
      title: args.title,
      tagline: args.tagline,
      description: args.description,
      industry: args.industry,
      fundingGoal: args.fundingGoal,
      equityOffered: args.equityOffered,
      status: 'published', // Auto-publish for MVP
      logoUrl: args.logoUrl,
      pitchDeckUrl: args.pitchDeckUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create the associated workspace
    const workspaceId = await ctx.db.insert('workspaces', {
      projectId: projectId,
      name: args.title, // Workspace name defaults to Project Title
      members: [user._id], // Owner is the first member
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Link the workspace back to the project
    await ctx.db.patch(projectId, { workspaceId });

    return projectId;
  },
});

// List projects for the discovery feed
export const list = query({
  args: {
    industry: v.optional(v.string()),
    // Add more filters as needed
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query('projects').withIndex('by_status', (q) => q.eq('status', 'published'));

    if (args.industry) {
      // Note: This simple filter might need a compound index or client-side filtering if complex
      // For MVP, we'll filter in memory if the index isn't perfect, or use the specific index
      // But we defined 'by_industry_status' so we can use that!
      q = ctx.db
        .query('projects')
        .withIndex('by_industry_status', (q) => q.eq('industry', args.industry!).eq('status', 'published'));
    }

    return await q.collect();
  },
});

// Get a single project by ID
export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get projects owned by the current user
export const getMyProjects = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', user._id))
      .collect();
  },
});

// Get projects owned by a specific user (public profile)
export const getUserProjects = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
      .collect();
  },
});

