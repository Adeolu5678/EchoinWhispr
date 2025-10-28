import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Proposal } from '../types';

/**
 * useCommunityGovernance Hook
 *
 * Hook for managing Convex-powered community governance functionality.
 * Provides functions for proposal creation and voting using Convex database.
 */
export const useCommunityGovernance = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Use Convex queries and mutations
  const proposals = useQuery(api.governanceProposals.getActiveProposals) || [];
  const createProposalMutation = useMutation(api.governanceProposals.createGovernanceProposal);
  const voteOnProposalMutation = useMutation(api.governanceProposals.voteOnProposal);

  /**
   * Creates a new governance proposal.
   * @param title - The title of the proposal
   * @param description - The description of the proposal
   */
  const createProposal = async (
    title: string,
    description: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Get current user ID (assuming it's available from auth context)
      const userId = 'current-user-id'; // TODO: Get from auth context
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days from now

      await createProposalMutation({
        title,
        description,
        proposerId: userId as any,
        expiresAt,
      });

      console.log('Proposal created successfully:', { title, description });
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Votes on a governance proposal.
   * @param proposalId - The ID of the proposal
   * @param vote - The vote (true for yes, false for no)
   */
  const voteOnProposal = async (
    _proposalId: string,
    vote: boolean
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Get current user ID (assuming it's available from auth context)
      const userId = 'current-user-id'; // TODO: Get from auth context

      await voteOnProposalMutation({
        proposalId: _proposalId as any,
        userId: userId as any,
        vote: vote ? 'for' : 'against',
      });

      console.log('Vote cast successfully:', { proposalId: _proposalId, vote });
    } catch (error) {
      console.error('Failed to vote on proposal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gets all governance proposals.
   */
  const getProposals = async (): Promise<Proposal[]> => {
    // Proposals are automatically fetched via useQuery
    // This method is kept for compatibility but doesn't need to do anything
    return proposals;
  };

  /**
   * Gets a specific proposal by ID.
   * @param proposalId - The ID of the proposal
   */
  const getProposal = async (_proposalId: string): Promise<Proposal | null> => {
    // For now, return null as we don't have a specific query for single proposal
    // This can be implemented later if needed
    return null;
  };

  return {
    proposals,
    isLoading,
    createProposal,
    voteOnProposal,
    getProposals,
    getProposal,
  };
};