'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Fetch current user from Convex to get role
  const convexUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return null;
  if (!user) return null;

  if (convexUser === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  // If user has no role, we might need to prompt them. 
  // For now, let's assume they are an Entrepreneur if undefined, or show a selection screen.
  // Let's implement a simple selection if role is missing.
  if (convexUser && !convexUser.role) {
    return <RoleSelection />;
  }

  const isEntrepreneur = convexUser?.role === 'entrepreneur';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}


      <main className="max-w-7xl mx-auto px-6 py-8">
        {isEntrepreneur ? <EntrepreneurDashboard /> : <InvestorDashboard />}
      </main>
    </div>
  );
}

function RoleSelection() {
  const setRole = useMutation(api.users.setRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = async (role: 'entrepreneur' | 'investor') => {
    setIsSubmitting(true);
    try {
      await setRole({ role });
      // The query in the parent component will automatically update and switch the view
    } catch (error) {
      console.error("Failed to set role:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-slate-400 mb-8">Are you here to build or to invest?</p>
        <div className="space-y-4">
          <button 
            onClick={() => handleRoleSelect('entrepreneur')}
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            I am an Entrepreneur
          </button>
          <button 
            onClick={() => handleRoleSelect('investor')}
            disabled={isSubmitting}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl font-medium transition-colors"
          >
            I am an Investor
          </button>
        </div>
      </div>
    </div>
  );
}

function EntrepreneurDashboard() {
  const myProjects = useQuery(api.projects.getMyProjects) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Link 
          href="/projects/create" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {myProjects.length === 0 ? (
        <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center bg-slate-900/30">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 mb-6">Start your journey by creating your first project.</p>
          <Link 
            href="/projects/create" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="block group">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center text-xl font-bold text-indigo-400">
                    {project.title[0]}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    project.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{project.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function InvestorDashboard() {
  const projects = useQuery(api.projects.list, {}) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 w-64"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project._id} href={`/projects/${project._id}`} className="block group">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors h-full flex flex-col">
              <div className="h-32 bg-slate-800 relative">
                {/* Placeholder cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                   {project.title[0]}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                    {project.industry}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{project.tagline}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="text-sm">
                    <span className="text-slate-400">Goal:</span> <span className="text-white font-medium">${project.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-400">Equity:</span> <span className="text-white font-medium">{project.equityOffered}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
