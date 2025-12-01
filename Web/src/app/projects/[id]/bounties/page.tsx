'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { CheckCircle, Circle, DollarSign, Plus, User } from 'lucide-react';
import Link from 'next/link';

export default function BountiesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const bounties = useQuery(api.bounties.list, { projectId }) || [];
  const createBounty = useMutation(api.bounties.create);
  const claimBounty = useMutation(api.bounties.claim);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');

  if (!project || !user) return null;

  const isOwner = user._id === project.ownerId;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBounty({
      projectId,
      title,
      description,
      reward,
    });
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setReward('');
  };

  const handleClaim = async (bountyId: Id<'bounties'>) => {
    if (confirm('Are you sure you want to claim this bounty?')) {
      await claimBounty({ id: bountyId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/projects/${projectId}`} className="text-sm text-slate-400 hover:text-white mb-2 block">
              &larr; Back to Project
            </Link>
            <h1 className="text-2xl font-bold">Micro-Bounties</h1>
            <p className="text-slate-400">Small tasks, big impact. Earn rewards by contributing.</p>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Post Bounty
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {bounties.map((bounty) => (
            <div key={bounty._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{bounty.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    bounty.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' :
                    bounty.status === 'assigned' ? 'bg-indigo-500/10 text-indigo-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {bounty.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{bounty.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center text-emerald-400 font-medium">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {bounty.reward}
                  </div>
                  {bounty.assigneeId && (
                    <div className="flex items-center text-slate-500">
                      <User className="w-4 h-4 mr-1" />
                      Assigned
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && bounty.status === 'open' && (
                <button
                  onClick={() => handleClaim(bounty._id)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                >
                  Claim Bounty
                </button>
              )}
            </div>
          ))}

          {bounties.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
              No bounties available yet.
            </div>
          )}
        </div>

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Post a Bounty</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Reward</label>
                  <input
                    type="text"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="e.g. $500 or 0.5% Equity"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
                  >
                    Post Bounty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
