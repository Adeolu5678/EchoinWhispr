import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table - synced with Clerk
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    
    // Launchpad Specific Fields
    role: v.optional(v.union(v.literal('entrepreneur'), v.literal('investor'))),
    professionalBio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),

    // Profile & Settings
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    notificationPreferences: v.optional(v.object({
      email: v.boolean(),
      push: v.boolean(),
    })),
    privacySettings: v.optional(v.object({
      profileVisibility: v.union(v.literal('public'), v.literal('private')),
    })),
    avatarStorageId: v.optional(v.string()),
    
    // Legacy fields
    needsUsernameSelection: v.optional(v.boolean()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_role', ['role']),

  // Certifications table - for user verification
  certifications: defineTable({
    userId: v.id('users'),
    title: v.string(),
    imageUrl: v.string(),
    status: v.union(v.literal('pending'), v.literal('verified'), v.literal('rejected')),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_status', ['status']),

  // Projects table - the core entity for Entrepreneurs
  projects: defineTable({
    ownerId: v.id('users'),
    workspaceId: v.optional(v.id('workspaces')), // Linked after workspace creation
    title: v.string(),
    tagline: v.string(),
    description: v.string(),
    industry: v.string(),
    fundingGoal: v.number(),
    equityOffered: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('funded'), v.literal('closed')),
    logoUrl: v.optional(v.string()),
    pitchDeckUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_status', ['status'])
    .index('by_industry_status', ['industry', 'status']) // For filtering
    .index('by_funding_status', ['fundingGoal', 'status']), // For filtering

  // Workspaces table - for team collaboration
  workspaces: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
    members: v.array(v.id('users')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId']),

  // Applications table - for joining projects
  applications: defineTable({
    applicantId: v.id('users'),
    projectId: v.id('projects'),
    role: v.string(), // e.g. "Co-founder", "CTO"
    message: v.string(),
    status: v.union(v.literal('pending'), v.literal('interviewing'), v.literal('accepted'), v.literal('rejected')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_applicant', ['applicantId'])
    .index('by_project_status', ['projectId', 'status']),

  // Conversations table - supports Direct (Investor-Founder), Team (Workspace), and Interview chats
  conversations: defineTable({
    participantIds: v.array(v.id('users')),
    workspaceId: v.optional(v.id('workspaces')),
    applicationId: v.optional(v.id('applications')),
    type: v.optional(v.union(v.literal('direct'), v.literal('workspace_general'), v.literal('interview'))),
    lastMessageId: v.optional(v.id('messages')),
    // Legacy fields
    status: v.optional(v.string()),
    participantKey: v.optional(v.string()),
    initialWhisperId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_workspace', ['workspaceId'])
    .index('by_application', ['applicationId'])
    .index('by_type', ['type']),

  // Messages table
  messages: defineTable({
    conversationId: v.id('conversations'),
    senderId: v.id('users'),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_conversation', ['conversationId']),

  // Milestones table - for "Living Pitch Deck"
  milestones: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    date: v.number(), // Target date
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('verified')),
    verifiedBy: v.optional(v.id('users')), // Admin or trusted user
    createdAt: v.number(),
  })
    .index('by_project', ['projectId']),

  // Bounties table - for "Micro-Bounties"
  bounties: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    reward: v.string(), // e.g. "$500" or "0.5% Equity"
    status: v.union(v.literal('open'), v.literal('assigned'), v.literal('completed'), v.literal('paid')),
    assigneeId: v.optional(v.id('users')),
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status']),

  // Soft Circles table - for Investor interest
  soft_circles: defineTable({
    projectId: v.id('projects'),
    investorId: v.id('users'),
    amount: v.number(),
    status: v.union(v.literal('interested'), v.literal('committed'), v.literal('withdrawn')),
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_investor', ['investorId']),

  // Vouches table - for Reputation
  vouches: defineTable({
    voucherId: v.id('users'),
    targetId: v.id('users'),
    relationship: v.string(), // e.g. "Former Co-founder"
    text: v.string(),
    createdAt: v.number(),
  })
    .index('by_target', ['targetId'])
    .index('by_voucher', ['voucherId']),

  // Feature Flags table
  featureFlags: defineTable({
    name: v.string(),
    enabled: v.boolean(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name']),

  // Friends table
  friends: defineTable({
    userId: v.id('users'),
    friendId: v.id('users'),
    status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('rejected')),
    message: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_friend', ['userId', 'friendId'])
    .index('by_user_status', ['userId', 'status'])
    .index('by_friend_status', ['friendId', 'status']),
});
