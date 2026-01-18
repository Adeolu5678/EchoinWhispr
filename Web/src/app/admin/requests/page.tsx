'use client';

import { useState } from 'react';
import { Users, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminRequestList } from '@/features/admin/components';
import { useAdminData, useAdminActions } from '@/features/admin/hooks';

export default function AdminRequestsPage() {
  const { pendingRequests, pendingRequestsLoading, allAdmins, allAdminsLoading, isSuperAdmin } = useAdminData();
  const { grantAdminRole, revokeAdminRole, promoteToSuperAdmin, isLoading } = useAdminActions();
  const [grantUsername, setGrantUsername] = useState('');

  const handleGrantRole = async () => {
    if (!grantUsername.trim()) return;
    const success = await grantAdminRole(grantUsername.trim());
    if (success) {
      setGrantUsername('');
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
      {/* Pending Requests Section */}
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
