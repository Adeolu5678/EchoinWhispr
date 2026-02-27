'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useFeatureFlag } from '@/hooks/useFeatureFlags';
import { MysterySettings } from '@/features/whispers/components/MysterySettings';
import { NotificationSettings } from '@/features/profile/components/NotificationSettings';
import { RequestAdminModal } from '@/features/admin/components';
import { useAdminData } from '@/features/admin/hooks';
import { Settings as SettingsIcon, Eye, Moon, Sun, Monitor, Heart, Briefcase, GraduationCap, Palette, Shield, Crown, ArrowRight, AtSign, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameChangeReason, setUsernameChangeReason] = useState('');
  const [isRequestingUsernameChange, setIsRequestingUsernameChange] = useState(false);
  const isMysteryWhispersEnabled = useFeatureFlag('MYSTERY_WHISPERS');
  const isPushNotificationsEnabled = useFeatureFlag('PUSH_NOTIFICATIONS');
  const { isAdmin, myRequestStatus } = useAdminData();

  const preferences = useQuery(api.users.getPreferences);
  const resonancePrefs = useQuery(api.resonance.getResonancePreferences);
  const lifePhases = useQuery(api.resonance.getLifePhases);
  const currentUser = useQuery(api.users.getCurrentUser);
  const hasAdmins = useQuery(api.admin.hasAdmins);
  const myUsernameChangeRequest = useQuery(api.users.getMyUsernameChangeRequest);

  const updatePreferences = useMutation(api.users.updatePreferences);
  const updateResonancePrefs = useMutation(api.resonance.updateResonancePreferences);
  const updateLifePhase = useMutation(api.resonance.updateLifePhase);
  const updateMentorship = useMutation(api.resonance.updateMentorshipPreferences);
  const initializeFirstSuperAdmin = useMutation(api.admin.initializeFirstSuperAdmin);
  const requestUsernameChange = useMutation(api.users.requestUsernameChange);

  const handleRequestUsernameChange = async () => {
    if (!newUsername.trim()) return;
    setIsRequestingUsernameChange(true);
    try {
      await requestUsernameChange({
        requestedUsername: newUsername.trim().toLowerCase(),
        reason: usernameChangeReason.trim() || undefined,
      });
      toast({ title: 'Request submitted!', description: 'Admins will review your request shortly.' });
      setNewUsername('');
      setUsernameChangeReason('');
    } catch (error) {
      toast({ title: 'Request failed', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setIsRequestingUsernameChange(false);
    }
  };

  // Sync saved theme preference from Convex to next-themes on load
  useEffect(() => {
    if (preferences?.themePreference && preferences.themePreference !== theme) {
      setTheme(preferences.themePreference);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences?.themePreference, setTheme]);

  const handlePreferenceChange = async (key: string, value: unknown) => {
    try {
      await updatePreferences({ [key]: value });
      // If changing theme preference, also update next-themes
      if (key === 'themePreference') {
        setTheme(value as string);
      }
      toast({ title: "Settings saved" });
    } catch (error) {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResonanceChange = async (updates: any) => {
    try {
      // Ensure all required fields are present with defaults
      const currentPrefs = {
        preferSimilarMood: resonancePrefs?.preferSimilarMood ?? true,
        preferComplementaryMood: resonancePrefs?.preferComplementaryMood ?? false,
        matchLifePhase: resonancePrefs?.matchLifePhase ?? true,
        preferMentor: resonancePrefs?.preferMentor ?? false,
        preferMentee: resonancePrefs?.preferMentee ?? false,
      };
      await updateResonancePrefs({ ...currentPrefs, ...updates });
      toast({ title: "Preferences updated" });
    } catch (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const handleLifePhaseChange = async (phase: string) => {
    try {
      // If same phase is clicked, unselect it
      const newPhase = currentUser?.lifePhase === phase ? '' : phase;
      await updateLifePhase({ lifePhase: newPhase });
      toast({ title: newPhase ? "Life phase updated" : "Life phase cleared" });
    } catch (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const handleMentorshipChange = async (key: string, value: boolean) => {
    try {
      await updateMentorship({ [key]: value });
      toast({ title: "Mentorship settings updated" });
    } catch (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

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

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg">
              <Palette className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="resonance" className="rounded-lg">
              <Heart className="w-4 h-4 mr-2" />
              Resonance
            </TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-lg">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Appearance
              </h2>
              <div>
                <Label className="mb-3 block">Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('themePreference', 'light')}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('themePreference', 'dark')}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePreferenceChange('themePreference', 'system')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </Card>

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

            {/* Username Change Request */}
            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-1 flex items-center gap-2">
                <AtSign className="w-5 h-5 text-primary" />
                Change Username
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your current username is <span className="font-mono text-foreground">@{currentUser?.username}</span>.
                Username changes require admin approval.
              </p>

              {/* Show existing request status */}
              {myUsernameChangeRequest && myUsernameChangeRequest.status === 'pending' && (
                <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-400">Request pending</p>
                    <p className="text-muted-foreground">
                      Your request to change to <span className="font-mono">@{myUsernameChangeRequest.requestedUsername}</span> is awaiting admin review.
                    </p>
                  </div>
                </div>
              )}
              {myUsernameChangeRequest && myUsernameChangeRequest.status === 'approved' && (
                <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-400">Last request approved</p>
                    <p className="text-muted-foreground">
                      Username was changed to <span className="font-mono">@{myUsernameChangeRequest.requestedUsername}</span>.
                    </p>
                  </div>
                </div>
              )}
              {myUsernameChangeRequest && myUsernameChangeRequest.status === 'rejected' && (
                <div className="mb-4 flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-400">Last request rejected</p>
                    {myUsernameChangeRequest.rejectionReason && (
                      <p className="text-muted-foreground">{myUsernameChangeRequest.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Only show form if no pending request */}
              {myUsernameChangeRequest?.status !== 'pending' && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="new-username" className="text-sm">Requested username</Label>
                    <Input
                      id="new-username"
                      placeholder="e.g. newcoolname"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value.toLowerCase())}
                      className="bg-white/5 border-white/10 focus:border-primary/50 font-mono"
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground">3–20 characters, letters/numbers/underscores only</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="username-reason" className="text-sm">Reason (optional)</Label>
                    <Textarea
                      id="username-reason"
                      placeholder="Why do you want to change your username?"
                      value={usernameChangeReason}
                      onChange={e => setUsernameChangeReason(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[80px] resize-none"
                      maxLength={300}
                    />
                  </div>
                  <Button
                    onClick={handleRequestUsernameChange}
                    disabled={!newUsername.trim() || isRequestingUsernameChange}
                    className="gap-2"
                  >
                    {isRequestingUsernameChange ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
                    ) : (
                      <><AtSign className="w-4 h-4" />Submit Request</>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Resonance Settings */}
          <TabsContent value="resonance" className="space-y-4">
            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Life Phase
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Help us match you with people in similar life stages
              </p>
              <div className="flex flex-wrap gap-2">
                {lifePhases?.map((phase) => (
                  <Badge
                    key={phase.id}
                    variant={currentUser?.lifePhase === phase.id ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleLifePhaseChange(phase.id)}
                  >
                    {phase.label}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Matching Preferences
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Similar Mood</Label>
                    <p className="text-xs text-muted-foreground">Match with people feeling the same way</p>
                  </div>
                  <Switch
                    checked={resonancePrefs?.preferSimilarMood ?? true}
                    onCheckedChange={(checked) => handleResonanceChange({ preferSimilarMood: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Complementary Vibes</Label>
                    <p className="text-xs text-muted-foreground">Match with people who balance your mood</p>
                  </div>
                  <Switch
                    checked={resonancePrefs?.preferComplementaryMood ?? false}
                    onCheckedChange={(checked) => handleResonanceChange({ preferComplementaryMood: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Same Life Phase</Label>
                    <p className="text-xs text-muted-foreground">Connect with people at similar life stages</p>
                  </div>
                  <Switch
                    checked={resonancePrefs?.matchLifePhase ?? true}
                    onCheckedChange={(checked) => handleResonanceChange({ matchLifePhase: checked })}
                  />
                </div>
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-400" />
                Mentorship
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Seeking a Mentor</Label>
                    <p className="text-xs text-muted-foreground">Get matched with people willing to guide</p>
                  </div>
                  <Switch
                    checked={currentUser?.seekingMentorship ?? false}
                    onCheckedChange={(checked) => handleMentorshipChange('seekingMentorship', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Offering Mentorship</Label>
                    <p className="text-xs text-muted-foreground">Help guide others on their journey</p>
                  </div>
                  <Switch
                    checked={currentUser?.offeringMentorship ?? false}
                    onCheckedChange={(checked) => handleMentorshipChange('offeringMentorship', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                Message Privacy
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Read Receipts</Label>
                    <p className="text-xs text-muted-foreground">Let others know when you&apos;ve read their messages</p>
                  </div>
                  <Switch
                    checked={preferences?.readReceiptsEnabled ?? true}
                    onCheckedChange={(checked) => handlePreferenceChange('readReceiptsEnabled', checked)}
                  />
                </div>
              </div>
            </Card>

            {/* Admin Access Section */}
            <Card className="glass border-white/10 p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Admin Access
              </h2>
              {/* Show initialize button when no admins exist */}
              {hasAdmins === false ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400">
                      No admins exist yet. Be the first super admin!
                    </p>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        await initializeFirstSuperAdmin();
                        toast({ title: 'Success', description: 'You are now a super admin!' });
                      } catch (error) {
                        toast({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to initialize', variant: 'destructive' });
                      }
                    }}
                    className="gap-2 bg-amber-500 hover:bg-amber-600"
                  >
                    <Crown className="w-4 h-4" />
                    Become First Super Admin
                  </Button>
                </div>
              ) : isAdmin ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You have admin privileges. Access the admin dashboard to monitor whispers.
                  </p>
                  <Button asChild className="gap-2">
                    <Link href="/admin">
                      <Shield className="w-4 h-4" />
                      Open Admin Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ) : myRequestStatus?.status === 'pending' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-400">
                      Your admin request is pending review.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Request admin privileges to monitor all whispers and see sender/recipient details.
                  </p>
                  <Button onClick={() => setAdminModalOpen(true)} variant="outline" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Request Admin Access
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Request Modal */}
        <RequestAdminModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
      </div>
    </div>
  );
}
