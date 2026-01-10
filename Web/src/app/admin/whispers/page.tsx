'use client';

import { MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhisperMonitor } from '@/features/admin/components';
import { useAdminWhispers } from '@/features/admin/hooks';

export default function AdminWhispersPage() {
  const { whispers, isLoading, hasMore, loadMore } = useAdminWhispers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Whisper Monitor</h2>
          <span className="text-sm text-muted-foreground">
            ({whispers.length} whispers)
          </span>
        </div>
        <Button variant="outline" size="sm" className="gap-2" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Info banner */}
      <div className="glass rounded-xl p-4 border border-primary/20 bg-primary/5">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-medium">Privacy Notice:</span> This view shows all whispers
          with full sender and recipient information. This data is sensitive and should be used
          only for moderation and trust/safety purposes.
        </p>
      </div>

      {/* Whisper table */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <WhisperMonitor whispers={whispers} isLoading={isLoading} />
        
        {hasMore && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => loadMore()} disabled={isLoading}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
