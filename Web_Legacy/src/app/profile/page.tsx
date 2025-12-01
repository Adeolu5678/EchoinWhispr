'use client';

import { useFeatureFlag } from '@/hooks/useFeatureFlags';
import { ProfileScreen } from '@/features/profile';
import { Lock, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const isProfileEditingEnabled = useFeatureFlag('USER_PROFILE_EDITING');

  if (!isProfileEditingEnabled) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center items-center">
        <div className="w-full max-w-md glass p-8 rounded-2xl border border-white/10 text-center">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Feature Locked</h1>
          <p className="text-muted-foreground">
            Profile editing is currently disabled. Check back later for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex items-center gap-3 glass p-6 rounded-2xl border border-white/10">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your identity in the void</p>
          </div>
        </header>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6">
            <ProfileScreen />
          </div>
        </div>
      </div>
    </div>
  );
}