import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Apply to a project
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    role: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    // Check if already applied
    const existingApp = await ctx.db
      .query('applications')
      .withIndex('by_applicant', (q) => q.eq('applicantId', user._id))
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .first();

    if (existingApp) {
      throw new Error('You have already applied to this project');
    }

    return await ctx.db.insert('applications', {
      applicantId: user._id,
      projectId: args.projectId,
      role: args.role,
      message: args.message,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get applications for a project (for Project Owner)
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    
    if (!user) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== user._id) {
      // Only owner can see applications
      return [];
    }

    return await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Get my applications (for Entrepreneur)
export const getMyApplications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    
    if (!user) return [];

    const applications = await ctx.db
      .query('applications')
      .withIndex('by_applicant', (q) => q.eq('applicantId', user._id))
      .collect();

    // Fetch project details for each application
    const applicationsWithProjects = await Promise.all(
      applications.map(async (app) => {
        const project = await ctx.db.get(app.projectId);
        return { ...app, project };
      })
    );

    return applicationsWithProjects;
  },
});

// Accept an application
export const accept = mutation({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    const project = await ctx.db.get(application.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.applicationId, {
      status: 'accepted',
      updatedAt: Date.now(),
    });

    // Create a workspace conversation (interview)
    // We need to add the applicant to the workspace or start an interview chat.
    // For now, let's create an "interview" type conversation.
    
    // Check if interview conversation already exists
    // We don't have an index for this specific case easily, but we can query conversations by applicationId if we added that field.
    // I added `applicationId` to conversations table in schema! (Step 144)
    
    const existingConv = await ctx.db
      .query('conversations')
      .withIndex('by_application', q => q.eq('applicationId', args.applicationId))
      .first();

    if (!existingConv) {
        await ctx.db.insert('conversations', {
            participantIds: [project.ownerId, application.applicantId],
            type: 'interview',
            workspaceId: project.workspaceId,
            applicationId: args.applicationId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }

    return args.applicationId;
  },
});

// Reject an application
export const reject = mutation({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    const project = await ctx.db.get(application.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.applicationId, {
      status: 'rejected',
      updatedAt: Date.now(),
    });

    return args.applicationId;
  },
});
