'use client';

import { useState } from 'react';
import { Users, UserPlus, Shield, AtSign, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminRequestList } from '@/features/admin/components';
import { useAdminData, useAdminActions } from '@/features/admin/hooks';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function AdminRequestsPage() {
  const { pendingRequests, pendingRequestsLoading, allAdmins, allAdminsLoading, isSuperAdmin } = useAdminData();
  const { grantAdminRole, revokeAdminRole, promoteToSuperAdmin, isLoading } = useAdminActions();
  const [grantUsername, setGrantUsername] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const { toast } = useToast();

  const pendingUsernameRequests = useQuery(api.users.getPendingUsernameChangeRequests);
  const approveUsernameChange = useMutation(api.users.approveUsernameChange);
  const rejectUsernameChange = useMutation(api.users.rejectUsernameChange);

  const handleGrantRole = async () => {
    if (!grantUsername.trim()) return;
    const success = await grantAdminRole(grantUsername.trim());
    if (success) {
      setGrantUsername('');
    }
  };

  const handleApproveUsername = async (requestId: string) => {
    try {
      await approveUsernameChange({ requestId: requestId as Parameters<typeof approveUsernameChange>[0]['requestId'] });
      toast({ title: 'Username change approved!', description: 'The user\'s username has been updated.' });
    } catch (error) {
      toast({ title: 'Approval failed', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleRejectUsername = async (requestId: string) => {
    try {
      await rejectUsernameChange({
        requestId: requestId as Parameters<typeof rejectUsernameChange>[0]['requestId'],
        rejectionReason: rejectReason.trim() || undefined,
      });
      toast({ title: 'Request rejected.' });
      setActiveRejectId(null);
      setRejectReason('');
    } catch (error) {
      toast({ title: 'Rejection failed', description: error instanceof Error ? error.message : 'Please try again.', variant: 'destructive' });
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="glass rounded-xl p-8 text-center border border-white/10">
        <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          Super Admin privileges are required to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pending Admin Requests Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Pending Admin Requests</h2>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
              {pendingRequests.length} pending
            </span>
          )}
        </div>
        <AdminRequestList requests={pendingRequests} isLoading={pendingRequestsLoading} />
      </section>

      {/* Username Change Requests Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <AtSign className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Username Change Requests</h2>
          {pendingUsernameRequests && pendingUsernameRequests.length > 0 && (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">
              {pendingUsernameRequests.length} pending
            </span>
          )}
        </div>

        {!pendingUsernameRequests ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse border border-white/10 h-16" />
            ))}
          </div>
        ) : pendingUsernameRequests.length === 0 ? (
          <div className="glass rounded-xl p-6 border border-white/10 text-center text-muted-foreground text-sm">
            No pending username change requests.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUsernameRequests.map((req) => (
              <div key={req._id} className="glass rounded-xl p-4 border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm space-y-0.5">
                    <p className="font-medium text-white">
                      <span className="font-mono text-muted-foreground">@{req.currentUsername}</span>
                      {' → '}
                      <span className="font-mono text-primary">@{req.requestedUsername}</span>
                    </p>
                    {req.reason && (
                      <p className="text-muted-foreground text-xs">&ldquo;{req.reason}&rdquo;</p>
                    )}
                    <p className="text-xs text-muted-foreground/60">
                      {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10 gap-1.5"
                      onClick={() => handleApproveUsername(req._id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1.5"
                      onClick={() => setActiveRejectId(activeRejectId === req._id ? null : req._id)}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>

                {activeRejectId === req._id && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Label className="text-xs">Rejection reason (optional)</Label>
                    <div className="flex gap-2">
                      <Textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Tell the user why their request was rejected..."
                        className="min-h-[60px] resize-none text-sm bg-white/5 border-white/10 flex-1"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="self-end"
                        onClick={() => handleRejectUsername(req._id)}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Direct Grant Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Grant Admin Directly</h2>
        </div>
        <div className="glass rounded-xl p-6 border border-white/10">
          <p className="text-sm text-muted-foreground mb-4">
            Grant admin privileges directly to a user by their username.
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="Enter username..."
              value={grantUsername}
              onChange={(e) => setGrantUsername(e.target.value)}
              className="max-w-xs"
            />
            <Button
              onClick={handleGrantRole}
              disabled={!grantUsername.trim() || isLoading}
            >
              Grant Admin
            </Button>
          </div>
        </div>
      </section>

      {/* Current Admins Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Current Admins</h2>
          <span className="text-sm text-muted-foreground">
            ({allAdmins.length} admins)
          </span>
        </div>
        
        {allAdminsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4 animate-pulse border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-24 bg-white/10 rounded" />
                  </div>
                  <div className="h-8 w-20 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {allAdmins.map((admin) => (
              <div
                key={admin._id}
                className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{admin.displayName}</span>
                    <span className="text-muted-foreground text-sm">@{admin.username}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        admin.role === 'super_admin'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {admin.role === 'super_admin' ? '👑 Super Admin' : 'Admin'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {admin.email} • Granted by {admin.grantedByUsername}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Promote to Super Admin button (only for regular admins) */}
                  {admin.role !== 'super_admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => promoteToSuperAdmin(admin.userId)}
                      disabled={isLoading}
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      Promote
                    </Button>
                  )}
                  {/* Revoke button (works for all roles now) */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeAdminRole(admin.userId)}
                    disabled={isLoading}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
