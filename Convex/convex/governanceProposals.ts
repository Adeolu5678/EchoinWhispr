import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const createGovernanceProposal = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    proposerId: v.id('users'),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const proposalId = await ctx.db.insert('governanceProposals', {
      title: args.title,
      description: args.description,
      proposerId: args.proposerId,
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
    return proposalId;
  },
});

export const voteOnProposal = mutation({
  args: {
    proposalId: v.id('governanceProposals'),
    userId: v.id('users'),
    vote: v.union(v.literal('for'), v.literal('against')),
  },
  handler: async (ctx, args) => {
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'active') {
      throw new Error('Proposal is not active');
    }

    if (Date.now() > proposal.expiresAt) {
      throw new Error('Proposal has expired');
    }

    // Update vote counts
    const updateData: Record<string, number> = {};
    if (args.vote === 'for') {
      updateData.votesFor = proposal.votesFor + 1;
    } else {
      updateData.votesAgainst = proposal.votesAgainst + 1;
    }

    await ctx.db.patch(args.proposalId, updateData);
    return args.proposalId;
  },
});

export const getActiveProposals = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query('governanceProposals')
      .withIndex('by_status', q => q.eq('status', 'active'))
      .filter(q => q.gt(q.field('expiresAt'), now))
      .order('desc')
      .collect();
  },
});

export const getProposalById = query({
  args: {
    proposalId: v.id('governanceProposals'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.proposalId);
  },
});

export const closeExpiredProposals = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredProposals = await ctx.db
      .query('governanceProposals')
      .withIndex('by_expires_at', q => q.lt('expiresAt', now))
      .filter(q => q.eq(q.field('status'), 'active'))
      .collect();

    for (const proposal of expiredProposals) {
      await ctx.db.patch(proposal._id, {
        status: 'closed',
      });
    }

    return expiredProposals.length;
  },
});