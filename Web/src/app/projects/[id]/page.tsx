'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, PieChart, FileText, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import Image from 'next/image';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  
  const createApplication = useMutation(api.applications.create);
  const createDirectMessage = useMutation(api.conversations.createDirectMessage);

  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationRole, setApplicationRole] = useState('');
  const [applicationSent, setApplicationSent] = useState(false);

  if (project === undefined || user === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (project === null) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Project not found.</div>;
  }

  const isOwner = user && user._id === project.ownerId;
  const isInvestor = user?.role === 'investor';
  const isEntrepreneur = user?.role === 'entrepreneur';

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationRole || !applicationMessage) return;
    
    try {
      await createApplication({
        projectId,
        role: applicationRole,
        message: applicationMessage,
      });
      setApplicationSent(true);
      setIsApplying(false);
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to apply. You may have already applied.');
    }
  };

  const handleContactFounder = async () => {
    try {
      const conversationId = await createDirectMessage({
        participantId: project.ownerId,
      });
      // Redirect to conversation
      // router.push(`/conversations/${conversationId}`);
      alert(`Conversation created! ID: ${conversationId}`);
    } catch (error) {
      console.error('Failed to contact founder:', error);
      alert('Failed to contact founder.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header Image / Pattern */}
      <div className="h-64 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Link href="/dashboard" className="flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  {project.logoUrl ? (
                    <Image src={project.logoUrl} alt={project.title} width={96} height={96} className="w-24 h-24 rounded-xl object-cover border-4 border-slate-800" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-slate-800">
                      {project.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                    <p className="text-xl text-indigo-400">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">
                    {project.industry}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    project.status === 'published' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold text-white mb-3">About the Project</h3>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{project.description}</p>
              </div>

              {project.pitchDeckUrl && (
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Pitch Deck</h3>
                  <a 
                    href={project.pitchDeckUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    View Pitch Deck (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            {/* Investment Terms */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Investment Terms</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-400">
                    <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                    <span>Funding Goal</span>
                  </div>
                  <span className="font-bold text-white">${project.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-slate-400">
                    <PieChart className="w-5 h-5 mr-3 text-indigo-500" />
                    <span>Equity Offered</span>
                  </div>
                  <span className="font-bold text-white">{project.equityOffered}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              
              {isOwner ? (
                <div className="space-y-3">
                  <Link 
                    href={`/workspaces/${project.workspaceId}`}
                    className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-lg font-medium transition-colors"
                  >
                    Go to Workspace
                  </Link>
                  <Link 
                    href={`/projects/${projectId}/milestones`}
                    className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-lg font-medium transition-colors"
                  >
                    Manage Milestones
                  </Link>
                  <Link 
                    href={`/projects/${projectId}/bounties`}
                    className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-lg font-medium transition-colors"
                  >
                    Manage Bounties
                  </Link>
                  <button className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-lg font-medium transition-colors">
                    Edit Project
                  </button>
                </div>
              ) : isInvestor ? (
                <>
                  <button 
                    onClick={handleContactFounder}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Founder
                  </button>
                  <Link 
                    href={`/projects/${projectId}/soft-circles`}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center mt-3"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Soft Circle
                  </Link>
                </>
              ) : isEntrepreneur ? (
                !applicationSent ? (
                  !isApplying ? (
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Apply to Join
                    </button>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                        <input 
                          type="text" 
                          value={applicationRole}
                          onChange={(e) => setApplicationRole(e.target.value)}
                          placeholder="e.g. CTO, Developer"
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                        <textarea 
                          value={applicationMessage}
                          onChange={(e) => setApplicationMessage(e.target.value)}
                          placeholder="Why are you a good fit?"
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setIsApplying(false)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <div className="w-full py-4 px-4 bg-green-900/20 border border-green-900/50 text-green-400 rounded-lg font-medium flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Application Sent
                  </div>
                )
              ) : (
                <div className="text-center text-slate-500 text-sm">
                  Log in to interact with this project.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
