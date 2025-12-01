'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Search, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProjectsPage() {
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const projects = useQuery(api.projects.list, { industry }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 px-6 pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Discover Projects</h1>
          <p className="text-slate-400 text-sm">Find the next big thing.</p>
        </div>
        <Link 
          href="/projects/create"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Create Project
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500"
          />
        </div>
        <button className="bg-slate-900 border border-slate-800 rounded-xl px-4 flex items-center justify-center hover:bg-slate-800 transition-colors">
          <Filter className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Trending / Featured (Placeholder) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Trending Now</h2>
        </div>
        {/* Horizontal Scroll or Grid */}
      </div>

      {/* Project List */}
      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No projects found. Be the first to launch!
          </div>
        ) : (
          projects.map((project: any) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-xl font-bold">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        project.title[0]
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">{project.title}</h3>
                      <p className="text-slate-400 text-xs">{project.industry}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">
                    {project.status}
                  </div>
                </div>
                <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                  {project.tagline}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-3">
                  <div>Target: ${project.fundingGoal.toLocaleString()}</div>
                  <div>Equity: {project.equityOffered}%</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
