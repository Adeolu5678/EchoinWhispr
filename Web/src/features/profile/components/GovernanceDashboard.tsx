'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useCommunityGovernance } from '../hooks/useCommunityGovernance';
import { useToast } from '@/hooks/use-toast';
import { Proposal } from '../types';

/**
 * GovernanceDashboard Component
 *
 * Component for Hedera-powered anonymous community governance functionality.
 * Displays proposal list and provides voting and proposal creation when the feature is enabled.
 */
export const GovernanceDashboard: React.FC = () => {
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { proposals, isLoading, createProposal, voteOnProposal, getProposals } = useCommunityGovernance();
  const { toast } = useToast();

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  const handleCreateProposal = async () => {
    if (!newProposalTitle.trim() || !newProposalDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and description',
        variant: 'destructive',
      });
      return;
    }

    if (isSubmitting) return; // Prevent double-clicking

    setIsSubmitting(true);
    try {
      await createProposal(newProposalTitle.trim(), newProposalDescription.trim());
      toast({
        title: 'Success',
        description: 'Proposal created successfully',
      });
      setNewProposalTitle('');
      setNewProposalDescription('');
      setIsCreateDialogOpen(false);
      // No need to call getProposals() as useQuery will automatically update
    } catch (error) {
      console.error('Failed to create proposal:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create proposal',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (proposalId: string, vote: boolean) => {
    if (isLoading) return; // Prevent double-clicking during loading

    try {
      await voteOnProposal(proposalId, vote);
      toast({
        title: 'Success',
        description: `Vote ${vote ? 'for' : 'against'} recorded`,
      });
      // No need to call getProposals() as useQuery will automatically update
    } catch (error) {
      console.error('Failed to cast vote:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cast vote',
        variant: 'destructive',
      });
    }
  };

  if (!FEATURE_FLAGS.HEDERA_POWERED_ANONYMOUS_COMMUNITY_GOVERNANCE) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Community Governance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">Active Proposals</div>
          <div className="text-sm text-gray-500">
            {isLoading ? 'Loading proposals...' : `${proposals.length} active proposals`}
          </div>
        </div>

        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="border rounded-lg p-4 text-center text-gray-500">
              No active proposals at this time
            </div>
          ) : (
            proposals.map((proposal: Proposal) => (
              <div key={proposal._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600">{proposal.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {proposal.status}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(proposal._id, true)}
                    disabled={isLoading}
                  >
                    Vote For ({proposal.votesFor})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(proposal._id, false)}
                    disabled={isLoading}
                  >
                    Vote Against ({proposal.votesAgainst})
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Create New Proposal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newProposalTitle}
                    onChange={(e) => setNewProposalTitle(e.target.value)}
                    placeholder="Enter proposal title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newProposalDescription}
                    onChange={(e) => setNewProposalDescription(e.target.value)}
                    placeholder="Enter proposal description"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProposal} disabled={isLoading || isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Proposal'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Hedera-powered anonymous community governance
        </div>
      </CardContent>
    </Card>
  );
};