'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { 
  Radio, 
  Plus, 
  Users, 
  Lock, 
  Globe, 
  Copy, 
  MessageSquare,
  Sparkles,
  Hash,
  MoreVertical,
  Settings,
  Image as ImageIcon
} from 'lucide-react';

export default function ChambersPage() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  // Create form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [maxMembers, setMaxMembers] = useState(50);
  const [isCreating, setIsCreating] = useState(false);

  const myChambers = useQuery(api.echoChambers.getMyChambers);
  const publicChambers = useQuery(api.echoChambers.listPublicChambers, { limit: 20 });
  const createChamber = useMutation(api.echoChambers.createChamber);
  const joinChamber = useMutation(api.echoChambers.joinChamber);

  const handleCreate = async () => {
    if (!name.trim() || !topic.trim()) {
      toast({
        title: "Missing fields",
        description: "Name and topic are required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createChamber({
        name: name.trim(),
        description: description.trim() || undefined,
        topic: topic.trim(),
        isPublic,
        maxMembers,
      });

      toast({
        title: "Chamber created! 🎉",
        description: "Share the invite link to get people in.",
      });

      // Copy invite link
      navigator.clipboard.writeText(`${window.location.origin}/chambers/join/${result.inviteCode}`);
      
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Create error:', error);
      toast({
        title: "Failed to create chamber",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Enter invite code",
        description: "Paste the 8-character invite code.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinChamber({ inviteCode: joinCode.trim() });
      
      if (result.alreadyMember) {
        toast({
          title: "Already a member",
          description: `You're ${result.anonymousAlias} in this chamber.`,
        });
      } else {
        toast({
          title: "Joined! 🎉",
          description: `You are now ${result.anonymousAlias}`,
        });
      }
      
      setJoinCode('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Check your invite code.";
      toast({
        title: "Failed to join",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTopic('');
    setIsPublic(false);
    setMaxMembers(50);
  };

  const copyInviteLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/chambers/join/${code}`);
    toast({
      title: "Link copied!",
      description: "Share it with others to join.",
    });
  };

  const handleJoinPublic = async (inviteCode: string) => {
    try {
      const result = await joinChamber({ inviteCode });
      if (result.alreadyMember) {
        toast({
          title: "Already a member",
          description: `You're already ${result.anonymousAlias}`,
        });
      } else {
        toast({
          title: "Joined! 🎉",
          description: `You are now ${result.anonymousAlias}`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Failed to join",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-3 rounded-xl">
                <Radio className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gradient">
                  Echo Chambers
                </h1>
                <p className="text-muted-foreground">
                  Anonymous group conversations
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Chamber
            </Button>
          </div>

          {/* Join by Code */}
          <div className="mt-6 flex gap-2">
            <Input
              placeholder="Enter invite code (e.g., ABC12345)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="max-w-xs font-mono tracking-wider"
            />
            <Button 
              variant="outline" 
              onClick={handleJoin}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join"}
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="my-chambers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger 
              value="my-chambers" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              My Chambers
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Globe className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-chambers" className="space-y-4">
            {myChambers?.length === 0 && (
              <Card className="glass border-white/10 p-12 text-center">
                <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No chambers yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create or join a chamber to start anonymous group chats
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Chamber
                </Button>
              </Card>
            )}

            {myChambers?.filter((c) => c !== null).map((chamber) => (
              <ChamberCard 
                key={chamber._id} 
                chamber={chamber} 
                onCopyLink={copyInviteLink}
                showAlias
              />
            ))}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            {publicChambers?.filter((c) => !c.isMember).length === 0 && (
              <Card className="glass border-white/10 p-12 text-center">
                <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No public chambers</h3>
                <p className="text-muted-foreground">
                  Be the first to create a public chamber or you&apos;ve already joined them all!
                </p>
              </Card>
            )}

            {publicChambers?.filter((c) => c !== null && !c.isMember).map((chamber) => (
              <ChamberCard 
                key={chamber._id} 
                chamber={chamber} 
                onCopyLink={copyInviteLink}
                showJoinButton={true}
                onJoin={handleJoinPublic}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Create Echo Chamber
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Chamber Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Chamber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., coding, music, career-advice"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What's this chamber about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="maxMembers">Max Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min={2}
                  max={500}
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 50)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public">Make Public</Label>
                  <p className="text-xs text-muted-foreground">
                    Anyone can discover and join
                  </p>
                </div>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600"
              >
                {isCreating ? "Creating..." : "Create Chamber"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Chamber Card Component
function ChamberCard({ 
  chamber, 
  onCopyLink,
  showAlias = false,
  showJoinButton = false,
  onJoin,
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chamber: any; 
  onCopyLink: (code: string) => void;
  showAlias?: boolean;
  showJoinButton?: boolean;
  onJoin?: (code: string) => Promise<void>;
}) {
  const [isJoiningCard, setIsJoiningCard] = useState(false);
  const router = useRouter();

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onJoin || !chamber.inviteCode) return;
    setIsJoiningCard(true);
    try {
      await onJoin(chamber.inviteCode);
    } finally {
      setIsJoiningCard(false);
    }
  };

  const handleCardClick = () => {
    if (!showJoinButton) {
      router.push(`/chambers/${chamber._id}`);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chamber.inviteCode) {
      onCopyLink(chamber.inviteCode);
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to chamber with settings dialog open
    router.push(`/chambers/${chamber._id}?settings=true`);
  };

  return (
    <Card 
      className={`glass border-white/10 p-6 transition-colors relative ${!showJoinButton ? 'hover:bg-white/5 cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Top right actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Unread count badge */}
        {chamber.unreadCount > 0 && (
          <div className="min-w-6 h-6 px-2 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
            {chamber.unreadCount > 99 ? '99+' : chamber.unreadCount}
          </div>
        )}
        
        {/* 3-dot menu (only for member chambers) */}
        {!showJoinButton && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              {chamber.inviteCode && (
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Invite Link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Content */}
      <div className="pr-20">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="text-lg font-semibold">{chamber.name}</h3>
          {chamber.isPublic ? (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              <Globe className="w-3 h-3 mr-1" />
              Public
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Hash className="w-4 h-4" />
            {chamber.topic}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {chamber.memberCount || 0} members
          </span>
        </div>

        {chamber.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {chamber.description}
          </p>
        )}

        {/* Last message preview */}
        {(chamber.lastMessage || chamber.lastMessageHasImage) && (
          <p className="text-sm text-muted-foreground mb-3 truncate flex items-center gap-1">
            <span className={`font-medium ${chamber.lastMessageIsOwn ? 'text-primary' : 'text-amber-300'}`}>
              {chamber.lastMessageSenderAlias}:
            </span>
            {chamber.lastMessageHasImage && (
              <ImageIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
            {chamber.lastMessage ? (
              <span className="truncate">{chamber.lastMessage}</span>
            ) : (
              <span className="italic">Photo</span>
            )}
          </p>
        )}

        {showAlias && (
          <Badge className="bg-cyan-500/20 text-cyan-300">
            You are: {chamber.userAlias}
          </Badge>
        )}
      </div>

      {/* Join button for discover section */}
      {showJoinButton && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
          <Button 
            size="sm" 
            onClick={handleJoinClick}
            disabled={isJoiningCard}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
          >
            <Users className="w-4 h-4 mr-2" />
            {isJoiningCard ? "Joining..." : "Join Chamber"}
          </Button>
        </div>
      )}
    </Card>
  );
}
