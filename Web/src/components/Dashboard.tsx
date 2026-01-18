'use client';

import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  Radio, 
  Sparkles, 
  Send,
  Inbox,
  Heart,
  Compass,
  Clock,
  Target,
  Zap,
  Mail,
  ArrowRight,
  Image as ImageIcon,
  UserPlus
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

/**
 * Creative Dashboard Component
 * 
 * A beautiful, non-clogged summary of the entire app with:
 * - Quick actions at the top for easy access
 * - Combined activity stats with friend requests
 * - Recent whispers and chambers side-by-side on desktop
 * - Mobile-first responsive design
 */
export function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  
  // Fetch all the necessary data
  const currentUser = useQuery(api.users.getCurrentUser);
  const pendingFriendRequests = useQuery(api.friends.getPendingRequests);
  const friendsList = useQuery(api.friends.getFriendsList, { limit: 10 });
  const myChambers = useQuery(api.echoChambers.getMyChambers);
  const resonancePrefs = useQuery(api.resonance.getResonancePreferences);
  const receivedWhispers = useQuery(api.whispers.getReceivedWhispers, { 
    paginationOpts: { numItems: 5, cursor: null } 
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = currentUser?.displayName || currentUser?.username || user?.firstName || 'there';
  const pendingRequests = pendingFriendRequests?.length || 0;
  const friendCount = friendsList?.totalCount || 0;
  const chambersCount = myChambers?.length || 0;
  const whispers = receivedWhispers?.page || [];
  const unreadWhispers = whispers.filter(w => !w.isRead).length;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Hero Section with Activity Stats + Friend Requests */}
        <header className="relative overflow-hidden rounded-3xl glass border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
                  {getGreeting()}, {displayName}!
                </h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Welcome back to EchoinWhispr. Here&apos;s what&apos;s happening in your connections.
                </p>
              </div>
              
              {/* Mood Badge */}
              {currentUser?.mood && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium">{currentUser.mood}</span>
                </div>
              )}
            </div>

            {/* Activity Stats + Friend Requests Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
              <StatPill icon={Mail} label="Whispers" value={whispers.length} color="from-purple-500 to-indigo-500" href="/inbox" />
              <StatPill icon={Radio} label="Chambers" value={chambersCount} color="from-amber-500 to-orange-500" href="/chambers" />
              <StatPill icon={Heart} label="Friends" value={friendCount} color="from-rose-500 to-pink-500" href="/friends" />
              <StatPill icon={Target} label="Profile" value={`${getProfileCompleteness(currentUser, resonancePrefs)}%`} color="from-cyan-500 to-blue-500" href="/profile" />
              
              {/* Friend Requests - highlighted if pending */}
              <Link href="/friends?tab=requests" className="col-span-2 md:col-span-1">
                <div className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border transition-all ${
                  pendingRequests > 0 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 hover:border-emerald-400'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0`}>
                    <UserPlus className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg md:text-xl font-bold truncate">{pendingRequests}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">Friend Requests</p>
                  </div>
                  {pendingRequests > 0 && (
                    <Badge className="bg-emerald-500 text-white text-[10px] px-1.5">New</Badge>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Quick Actions - Moved up for easy access */}
        <Card className="glass border-white/10 p-4 md:p-6 group hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickActionCard 
              href="/compose" 
              icon={Send} 
              label="Send Whisper" 
              gradient="from-purple-600 to-indigo-600"
            />
            <QuickActionCard 
              href="/inbox" 
              icon={Inbox} 
              label="View Inbox" 
              gradient="from-cyan-600 to-blue-600"
            />
            <QuickActionCard 
              href="/discover" 
              icon={Compass} 
              label="Discover" 
              gradient="from-emerald-600 to-teal-600"
            />
            <QuickActionCard 
              href="/chambers" 
              icon={Radio} 
              label="Chambers" 
              gradient="from-amber-600 to-orange-600"
            />
          </div>
        </Card>

        {/* Main Content Grid - Whispers and Chambers side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Whispers */}
          <Link href="/inbox" className="block">
            <Card className="glass border-white/10 p-6 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/5 group hover:border-purple-500/30 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  Recent Whispers
                  {unreadWhispers > 0 && (
                    <Badge className="bg-purple-600 text-white ml-2">
                      {unreadWhispers} new
                    </Badge>
                  )}
                </h2>
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              {whispers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Inbox className="w-8 h-8 text-purple-400/50" />
                  </div>
                  <p className="text-muted-foreground mb-4">No whispers yet. Start connecting!</p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={(e) => { e.preventDefault(); router.push('/discover'); }}
                  >
                    <Compass className="w-4 h-4 mr-2" /> Discover People
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {whispers.slice(0, 4).map((whisper) => (
                    <div 
                      key={whisper._id} 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/whispers/${whisper._id}`); }}
                      className={`p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        whisper.isRead 
                          ? 'bg-white/5 hover:bg-white/10 border border-transparent' 
                          : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20 hover:border-purple-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!whisper.isRead && (
                              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(whisper._creationTime), { addSuffix: true })}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${!whisper.isRead ? 'font-medium' : ''}`}>
                            {whisper.content}
                          </p>
                        </div>
                        {whisper.imageUrl && (
                          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-5 h-5 text-purple-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Link>

          {/* Chambers */}
          <Link href="/chambers" className="block">
            <Card className="glass border-white/10 p-6 group hover:border-amber-500/30 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-white" />
                  </div>
                  Chambers
                </h2>
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                  See All
                </Badge>
              </div>
              <div className="space-y-3">
                {myChambers?.filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined).slice(0, 4).map((chamber) => (
                    <div 
                      key={chamber._id} 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/chambers/${chamber._id}`); }}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-amber-500/30 cursor-pointer group/chamber relative"
                    >
                      {/* Unread count badge */}
                      {chamber.unreadCount > 0 && (
                        <div className="absolute top-2 right-2 min-w-5 h-5 px-1.5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center z-10">
                          {chamber.unreadCount > 99 ? '99+' : chamber.unreadCount}
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm truncate flex-1 pr-8">{chamber.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300 mb-2">
                        {chamber.topic}
                      </Badge>
                      {chamber.lastMessage || chamber.lastMessageHasImage ? (
                        <p className="text-xs text-muted-foreground truncate mt-2 flex items-center gap-1">
                          <span className={`font-medium ${chamber.lastMessageIsOwn ? 'text-primary' : 'text-amber-300'}`}>
                            {chamber.lastMessageSenderAlias}:
                          </span>
                          {chamber.lastMessageHasImage && (
                            <ImageIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          )}
                          {chamber.lastMessage ? (
                            <span className="truncate">{chamber.lastMessage}</span>
                          ) : (
                            <span className="italic">Photo</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 mt-2 italic">
                          No messages yet
                        </p>
                      )}
                    </div>
                  ))}
                {(!myChambers || myChambers.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm mb-4">You haven&apos;t joined any chambers yet</p>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <Compass className="w-4 h-4 mr-2" /> Discover Chambers
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}

// Helper function to calculate profile completeness
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProfileCompleteness(user: any, resonance: any): number {
  if (!user) return 0;
  let score = 0;
  if (user.username) score += 15;
  if (user.displayName) score += 15;
  if (user.mood) score += 20;
  if (user.career) score += 15;
  if (user.interests?.length > 0) score += 15;
  if (resonance?.lifePhase) score += 20;
  return Math.min(score, 100);
}

// Stat Pill Component - Mobile responsive, clickable
function StatPill({ icon: Icon, label, value, color, href }: { 
  icon: React.ElementType; 
  label: string; 
  value: number | string; 
  color: string;
  href?: string;
}) {
  const content = (
    <div className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-200 ${href ? 'hover:bg-white/10 hover:border-white/20 cursor-pointer' : ''}`}>
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-lg md:text-xl font-bold truncate">{value}</p>
        <p className="text-[10px] md:text-xs text-muted-foreground truncate">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Quick Action Card Component - Mobile responsive
function QuickActionCard({ href, icon: Icon, label, gradient }: {
  href: string;
  icon: React.ElementType;
  label: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <div className={`p-3 md:p-4 rounded-xl bg-gradient-to-br ${gradient} hover:scale-105 active:scale-95 transition-transform cursor-pointer text-center`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-white" />
        <p className="text-xs md:text-sm font-medium text-white">{label}</p>
      </div>
    </Link>
  );
}
