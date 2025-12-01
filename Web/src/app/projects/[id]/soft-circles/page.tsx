'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { DollarSign, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SoftCirclesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const commitments = useQuery(api.soft_circles.get, { projectId }) || [];
  const commit = useMutation(api.soft_circles.commit);

  const [amount, setAmount] = useState('');
  const [committed, setCommitted] = useState(false);

  if (!project || !user) return null;

  const isOwner = user._id === project.ownerId;
  const isInvestor = user.role === 'investor';

  const totalCommitted = commitments.reduce((sum: number, c: any) => sum + c.amount, 0);
  const percentFunded = Math.min(100, Math.round((totalCommitted / project.fundingGoal) * 100));

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    await commit({
      projectId,
      amount: Number(amount),
    });
    setCommitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={`/projects/${projectId}`} className="text-sm text-slate-400 hover:text-white mb-2 block">
            &larr; Back to Project
          </Link>
          <h1 className="text-2xl font-bold">Soft Circles</h1>
          <p className="text-slate-400">Gauge investor interest before the round opens.</p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">Total Soft Circled</div>
              <div className="text-3xl font-bold text-white">${totalCommitted.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Funding Goal</div>
              <div className="text-xl font-semibold text-slate-300">${project.fundingGoal.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${percentFunded}%` }}
            />
          </div>
          <div className="text-right text-sm text-emerald-400 font-medium">{percentFunded}% Committed</div>
        </div>

        {/* Investor Action */}
        {isInvestor && !committed && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">Express Interest</h2>
            <p className="text-slate-400 mb-6">
              Indicate your interest in this round. This is non-binding but helps the founder gauge demand.
            </p>
            <form onSubmit={handleCommit} className="flex gap-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (USD)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
              >
                Commit
              </button>
            </form>
          </div>
        )}

        {committed && (
          <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Interest Recorded!</h3>
            <p className="text-emerald-200/80">The founder has been notified of your soft commitment.</p>
          </div>
        )}

        {/* Owner View */}
        {isOwner && (
          <div>
            <h3 className="text-lg font-bold mb-4">Interested Investors</h3>
            {commitments.length === 0 ? (
              <div className="text-slate-500 italic">No commitments yet.</div>
            ) : (
              <div className="space-y-4">
                {commitments.map((c: any) => (
                  <div key={c._id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center font-bold">
                        INV
                      </div>
                      <div>
                        <div className="font-medium">Investor</div>
                        <div className="text-xs text-slate-500">Committed {new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="font-bold text-emerald-400">${c.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
