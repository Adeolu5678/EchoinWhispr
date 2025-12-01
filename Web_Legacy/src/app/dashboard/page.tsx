'use client';

import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import Link from 'next/link';
import { Plus, Filter } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrentUser);
  const myProjects = useQuery(api.projects.getMyProjects);
  const myApplications = useQuery(api.applications.getMyApplications);
  
  // State for investor filtering
  const [industryFilter, setIndustryFilter] = useState<string>('');
  const allProjects = useQuery(api.projects.list, { 
    industry: industryFilter || undefined 
  });

  if (user === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (user === null) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Please log in.</div>;
  }

  const isEntrepreneur = user.role === 'entrepreneur';
  const isInvestor = user.role === 'investor';

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.firstName || 'User'}.</p>
        </div>
        {isEntrepreneur && (
          <Link 
            href="/projects/create" 
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        )}
      </header>

      {isEntrepreneur && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-indigo-400">My Projects</h2>
          
          {myProjects === undefined ? (
            <div className="text-slate-500">Loading projects...</div>
          ) : myProjects.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400 mb-4">You haven&apos;t created any projects yet.</p>
              <Link 
                href="/projects/create" 
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Start your first project &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project._id}`}>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center text-xl font-bold text-slate-500 group-hover:text-indigo-400">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{project.tagline}</p>
                    <div className="flex items-center text-xs text-slate-500 space-x-4">
                      <span>{project.industry}</span>
                      <span>•</span>
                      <span>${project.fundingGoal.toLocaleString()} Goal</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 mt-12 text-indigo-400">My Applications</h2>
          
          {myApplications === undefined ? (
            <div className="text-slate-500">Loading applications...</div>
          ) : myApplications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
              <p className="text-slate-400">You haven&apos;t applied to any projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApplications.map((app) => (
                <div key={app._id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{app.project?.title || 'Unknown Project'}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      app.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                      app.status === 'accepted' ? 'bg-green-900/30 text-green-400 border-green-800' :
                      app.status === 'rejected' ? 'bg-red-900/30 text-red-400 border-red-800' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">Role: <span className="text-white">{app.role}</span></p>
                  <p className="text-slate-500 text-xs">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {isInvestor && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-400">Deal Flow</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select 
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-md text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Industries</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Health">Health</option>
                  <option value="AI">AI</option>
                  <option value="Consumer">Consumer</option>
                  <option value="B2B">B2B</option>
                </select>
              </div>
            </div>
          </div>

          {allProjects === undefined ? (
            <div className="text-slate-500">Loading deal flow...</div>
          ) : allProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No projects found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project._id}`}>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-colors cursor-pointer">
                    <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-end">
                       <h3 className="text-xl font-bold text-white">{project.title}</h3>
                       <p className="text-emerald-400 text-sm font-medium">{project.industry}</p>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-400 text-sm line-clamp-3 mb-4">{project.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <div>
                          <p className="text-xs text-slate-500">Seeking</p>
                          <p className="text-sm font-semibold text-white">${project.fundingGoal.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Equity</p>
                          <p className="text-sm font-semibold text-white">{project.equityOffered}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
      
      {!isEntrepreneur && !isInvestor && (
        <div className="text-center py-12">
          <p className="text-slate-400">Please complete your profile to select a role.</p>
          <Link href="/profile/edit" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  );
}
