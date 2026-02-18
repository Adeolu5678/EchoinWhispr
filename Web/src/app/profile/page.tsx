'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import Link from 'next/link';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Radio, 
  Heart,
  Target,
  Sparkles,
  Briefcase,
  MessageSquare,
  Calendar,
  Settings,
  ArrowRight,
  Lock
} from 'lucide-react';

export default function ProfilePage() {
  const { user: clerkUser, isLoaded } = useUser();
  const { toast } = useToast();
  const isProfileEditingEnabled = FEATURE_FLAGS.USER_PROFILE_EDITING;

  // Queries
  const currentUser = useQuery(api.users.getCurrentUser);
  const resonancePrefs = useQuery(api.resonance.getResonancePreferences);
  const myChambers = useQuery(api.echoChambers.getMyChambers);
  const friendsList = useQuery(api.friends.getFriendsList, { limit: 10 });
  const whispersCountQuery = useQuery(api.whispers.getReceivedWhispersCount);
  const whispersCount = whispersCountQuery?.count ?? 0;
  const whispersCountCapped = whispersCountQuery?.capped ?? false;

  // Mutations
  const updateProfile = useMutation(api.users.updateUserProfile);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    career: '',
    mood: '',
    interests: '',
  });

  // Initialize edit data when user data loads (only when not actively editing)
  useEffect(() => {
    // Guard: Only initialize when not actively editing to preserve in-progress edits
    if (currentUser && !isEditing) {
      setEditData({
        displayName: currentUser.displayName || '',
        career: currentUser.career || '',
        mood: currentUser.mood || '',
        interests: currentUser.interests?.join(', ') || '',
      });
    }
  }, [currentUser, isEditing]);

  // Computed values
  const chambersCount = myChambers?.length || 0;
  const friendCount = friendsList?.totalCount || 0;

  // Helper function to calculate profile completeness
  const getProfileCompleteness = (): number => {
    if (!currentUser) return 0;
    let score = 0;
    if (currentUser.username) score += 15;
    if (currentUser.displayName) score += 15;
    if (currentUser.mood) score += 20;
    if (currentUser.career) score += 15;
    if (currentUser.interests && currentUser.interests.length > 0) score += 15;
    if (resonancePrefs?.lifePhase) score += 20;
    return Math.min(score, 100);
  };

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.slice(0, 2).toUpperCase();
    }
    if (clerkUser?.firstName && clerkUser?.lastName) {
      return `${clerkUser.firstName.charAt(0)}${clerkUser.lastName.charAt(0)}`.toUpperCase();
    }
    if (currentUser?.username) {
      return currentUser.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: editData.displayName || undefined,
        career: editData.career || undefined,
        mood: editData.mood || undefined,
        interests: editData.interests ? editData.interests.split(',').map(i => i.trim()).filter(Boolean) : undefined,
      });
      toast({ title: 'Profile updated!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to current values
    if (currentUser) {
      setEditData({
        displayName: currentUser.displayName || '',
        career: currentUser.career || '',
        mood: currentUser.mood || '',
        interests: currentUser.interests?.join(', ') || '',
      });
    }
    setIsEditing(false);
  };

  // Feature locked state
  if (!isProfileEditingEnabled) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-10 px-4 md:px-8 lg:px-12 flex justify-center items-center">
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

  // Loading state
  if (!isLoaded || !currentUser) {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-40 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileCompletion = getProfileCompleteness();

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Profile Header Card */}
        <Card className="glass border-white/10 p-6 md:p-8 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/30">
                  <AvatarImage src={clerkUser?.imageUrl} alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl md:text-3xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {currentUser.mood && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3 py-1 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {currentUser.mood}
                    </Badge>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {currentUser.displayName || clerkUser?.firstName || currentUser.username}
                </h1>
                <p className="text-muted-foreground text-lg">@{currentUser.username}</p>
                
                {currentUser.career && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {currentUser.career}
                  </div>
                )}

                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {(() => {
                    if (!currentUser?.createdAt) return 'Unknown';
                    const date = new Date(currentUser.createdAt);
                    if (isNaN(date.getTime())) return 'Unknown';
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  })()}
                </div>

                {/* Interests */}
                {currentUser.interests && currentUser.interests.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    {currentUser.interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="bg-white/10 text-white/80">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto">
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-white/20 hover:bg-white/10">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-cyan-400">{profileCompletion}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              {profileCompletion < 100 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {profileCompletion < 50 
                    ? 'Add your mood, career, and interests to complete your profile!'
                    : 'Almost there! Add more details to reach 100%.'
                  }
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/inbox">
            <Card className="glass border-white/10 p-4 text-center hover:border-purple-500/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{whispersCountCapped ? '99+' : whispersCount}</p>
              <p className="text-xs text-muted-foreground">Whispers</p>
            </Card>
          </Link>
          
          <Link href="/chambers">
            <Card className="glass border-white/10 p-4 text-center hover:border-amber-500/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-2">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{chambersCount}</p>
              <p className="text-xs text-muted-foreground">Chambers</p>
            </Card>
          </Link>
          
          <Link href="/friends">
            <Card className="glass border-white/10 p-4 text-center hover:border-rose-500/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{friendCount}</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </Card>
          </Link>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card className="glass border-white/10 p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit Profile
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={editData.displayName}
                  onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="How should we call you?"
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="career">Career / Role</Label>
                <Input
                  id="career"
                  value={editData.career}
                  onChange={(e) => setEditData(prev => ({ ...prev, career: e.target.value }))}
                  placeholder="e.g., Software Engineer, Student, Designer"
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mood">Current Mood</Label>
                <Input
                  id="mood"
                  value={editData.mood}
                  onChange={(e) => setEditData(prev => ({ ...prev, mood: e.target.value }))}
                  placeholder="e.g., Excited, Curious, Reflective"
                  className="bg-white/5 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma separated)</Label>
                <Textarea
                  id="interests"
                  value={editData.interests}
                  onChange={(e) => setEditData(prev => ({ ...prev, interests: e.target.value }))}
                  placeholder="e.g., Coding, Music, Travel, Photography"
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Quick Links */}
        <Card className="glass border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link href="/settings" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">Privacy, notifications, theme</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/friends" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Friends</p>
                    <p className="text-xs text-muted-foreground">Manage connections</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
              </div>
            </Link>

            <Link href="/discover" className="block">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">Discover</p>
                    <p className="text-xs text-muted-foreground">Find new connections</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
              </div>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}