'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { Briefcase, Shield, User, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as Id<'users'>;
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const user = useQuery(api.users.getUser, { id: userId }) as any;
  const vouches = useQuery(api.vouches.list, { targetId: userId }) || [];
  const projects = useQuery(api.projects.getUserProjects, { userId }) || []; // Need to ensure this query exists or use list with filter
  const createVouch = useMutation(api.vouches.create);

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reputation'>('about');
  const [isVouching, setIsVouching] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [vouchText, setVouchText] = useState('');

  if (user === undefined) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (user === null) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">User not found.</div>;

  const isMe = currentUser?._id === user._id;

  const handleVouch = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVouch({
      targetId: userId,
      relationship,
      text: vouchText,
    });
    setIsVouching(false);
    setRelationship('');
    setVouchText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-900 to-slate-900">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user.username?.[0].toUpperCase()
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">
            @{user.username}
          </h1>
          {!isMe && currentUser && (
            <button 
              onClick={() => setIsVouching(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Vouch
            </button>
          )}
        </div>
        <p className="text-slate-400 mb-6 capitalize">{user.role}</p>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-800 mb-8">
          <TabButton 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')} 
            icon={User} 
            label="About" 
          />
          <TabButton 
            active={activeTab === 'portfolio'} 
            onClick={() => setActiveTab('portfolio')} 
            icon={Briefcase} 
            label="Portfolio" 
          />
          <TabButton 
            active={activeTab === 'reputation'} 
            onClick={() => setActiveTab('reputation')} 
            icon={Shield} 
            label="Reputation" 
          />
        </div>

        {/* Content */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Bio</h3>
              <p className="text-slate-400 leading-relaxed">
                {user.professionalBio || "No bio provided yet."}
              </p>
            </div>
            {user.linkedinUrl && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                  LinkedIn Profile
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid gap-4">
            {projects.length === 0 ? (
              <div className="text-slate-400 text-center py-12">No projects yet.</div>
            ) : (
              projects.map((project: any) => (
                <Link key={project._id} href={`/projects/${project._id}`}>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
                    <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                    <p className="text-slate-400 text-sm">{project.tagline}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="space-y-4">
            {vouches.length === 0 ? (
              <div className="text-slate-400 text-center py-12">No vouches yet.</div>
            ) : (
              vouches.map((vouch: any) => (
                <div key={vouch._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-xs font-bold">
                      {vouch.voucherName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{vouch.voucherName}</div>
                      <div className="text-xs text-slate-500">{vouch.relationship}</div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm italic">"{vouch.text}"</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vouch Modal */}
        {isVouching && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Vouch for @{user.username}</h2>
              <form onSubmit={handleVouch} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Worked together at Google"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Endorsement</label>
                  <textarea
                    value={vouchText}
                    onChange={(e) => setVouchText(e.target.value)}
                    placeholder="What makes them great?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none h-24"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVouching(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium"
                  >
                    Submit Vouch
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

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
        active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
      )}
    </button>
  );
}
