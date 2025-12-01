'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { TagInput } from '@/components/ui/TagInput';
import { Toggle } from '@/components/ui/Toggle';
import { User, Bell, Shield, Briefcase, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const user = useQuery(api.users.getCurrentUser) as any;
  const updateUser = useMutation(api.users.createOrUpdateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({ email: true, push: true });
  const [privacy, setPrivacy] = useState({ profileVisibility: 'public' });
  const [avatarStorageId, setAvatarStorageId] = useState<string | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    if (user) {
      setBio(user.professionalBio || '');
      setLinkedin(user.linkedinUrl || '');
      setSkills(user.skills || []);
      setInterests(user.interests || []);
      setNotifications(user.notificationPreferences || { email: true, push: true });
      setPrivacy(user.privacySettings || { profileVisibility: 'public' });
      setAvatarStorageId(user.avatarStorageId);
      setPreviewUrl(user.avatarUrl);
    }
  }, [user]);

  if (!user) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create local preview
      setPreviewUrl(URL.createObjectURL(file));

      // Get upload URL
      const postUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      setAvatarStorageId(storageId);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser({
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        professionalBio: bio,
        linkedinUrl: linkedin,
        skills,
        interests,
        notificationPreferences: notifications,
        privacySettings: privacy,
        avatarStorageId,
      } as any);
      // Optional: Add toast notification here
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your profile and preferences</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Basic Info */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Briefcase size={20} className="text-indigo-400" />
                    Professional Info
                  </h2>
                  
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <User size={32} />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                        <span className="text-xs font-medium text-white">Change</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-slate-400 mb-2">@{user.username}</p>
                      <p className="text-xs text-slate-500">Max file size: 5MB. Supported formats: JPG, PNG.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Professional Bio</label>
                      <textarea
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all h-32 resize-none"
                        placeholder="Tell us about your experience..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">LinkedIn URL</label>
                      <input
                        type="text"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* Skills & Interests */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-amber-400" />
                    Skills & Interests
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Skills</label>
                      <TagInput
                        tags={skills}
                        onTagsChange={setSkills}
                        placeholder="Add skills (e.g. React, Marketing)..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1.5">Interests</label>
                      <TagInput
                        tags={interests}
                        onTagsChange={setInterests}
                        placeholder="Add interests (e.g. Fintech, AI)..."
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Account Management</h2>
                  <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <p className="font-medium text-slate-200">Clerk Profile</p>
                      <p className="text-sm text-slate-500">Manage email, password, and security</p>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-200">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates via email</p>
                      </div>
                      <Toggle
                        checked={notifications.email}
                        onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-200">Push Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates in-browser</p>
                      </div>
                      <Toggle
                        checked={notifications.push}
                        onCheckedChange={(c) => setNotifications(prev => ({ ...prev, push: c }))}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">Profile Visibility</p>
                      <p className="text-sm text-slate-500">
                        {privacy.profileVisibility === 'public' 
                          ? 'Your profile is visible to everyone' 
                          : 'Your profile is only visible to connections'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setPrivacy({ profileVisibility: 'public' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          privacy.profileVisibility === 'public'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Public
                      </button>
                      <button
                        onClick={() => setPrivacy({ profileVisibility: 'private' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          privacy.profileVisibility === 'private'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Private
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Save Button */}
            <div className="sticky bottom-24 flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
