'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, MessageSquare, User } from 'lucide-react';
import { Id } from '@/lib/convex';

export default function ProjectApplicationsPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  const router = useRouter();
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const applications = useQuery(api.applications.listByProject, { projectId });
  
  const acceptApplication = useMutation(api.applications.accept);
  const rejectApplication = useMutation(api.applications.reject);

  if (project === undefined || user === undefined || applications === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (project === null) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Project not found.</div>;
  }

  if (user?._id !== project.ownerId) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Not authorized.</div>;
  }

  const handleAccept = async (appId: Id<'applications'>) => {
    try {
      await acceptApplication({ applicationId: appId });
      // Ideally show a toast
    } catch (error) {
      console.error('Failed to accept:', error);
      alert('Failed to accept application.');
    }
  };

  const handleReject = async (appId: Id<'applications'>) => {
    if (!confirm('Are you sure you want to reject this application?')) return;
    try {
      await rejectApplication({ applicationId: appId });
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject application.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href={`/projects/${projectId}`} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-white">Applications for {project.title}</h1>
        </div>

        {applications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500">
            No applications yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{app.role}</h3>
                      <p className="text-xs text-slate-500">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`ml-auto px-2 py-1 rounded text-xs font-medium border ${
                      app.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                      app.status === 'accepted' ? 'bg-green-900/30 text-green-400 border-green-800' :
                      app.status === 'rejected' ? 'bg-red-900/30 text-red-400 border-red-800' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <div className="bg-slate-950 rounded p-4 text-slate-300 text-sm mt-4">
                    {app.message}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex md:flex-col gap-2 justify-center">
                    <button 
                      onClick={() => handleAccept(app._id)}
                      className="flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleReject(app._id)}
                      className="flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-md text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
                
                {app.status === 'accepted' && (
                   <div className="flex md:flex-col gap-2 justify-center">
                    <button 
                      onClick={() => router.push('/dashboard')} // Placeholder for chat
                      className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
