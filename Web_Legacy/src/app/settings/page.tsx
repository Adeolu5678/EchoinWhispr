'use client';

import { useFeatureFlag } from '@/hooks/useFeatureFlags';
import { MysterySettings } from '@/features/whispers/components/MysterySettings';
import { NotificationSettings } from '@/features/profile/components/NotificationSettings';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const isMysteryWhispersEnabled = useFeatureFlag('MYSTERY_WHISPERS');
  const isPushNotificationsEnabled = useFeatureFlag('PUSH_NOTIFICATIONS');

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex items-center gap-3 glass p-6 rounded-2xl border border-white/10">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm">Manage your preferences and notifications</p>
          </div>
        </header>

        <div className="space-y-6">
          {isMysteryWhispersEnabled && (
            <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6">
                <MysterySettings />
              </div>
            </div>
          )}

          {isPushNotificationsEnabled && (
            <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6">
                <NotificationSettings />
              </div>
            </div>
          )}
          
          {!isMysteryWhispersEnabled && !isPushNotificationsEnabled && (
             <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 text-center text-muted-foreground">
                No settings available at this time.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
