'use client';

import { Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useAdminActions } from '../hooks/useAdminActions';

interface AdminRequest {
  _id: string;
  userId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  username: string;
  email: string;
  displayName: string;
}

interface AdminRequestCardProps {
  request: AdminRequest;
  onActionComplete?: () => void;
}

export function AdminRequestCard({ request, onActionComplete }: AdminRequestCardProps) {
  const { approveRequest, rejectRequest, isLoading } = useAdminActions();

  const handleApprove = async () => {
    const success = await approveRequest(request._id);
    if (success && onActionComplete) {
      onActionComplete();
    }
  };

  const handleReject = async () => {
    const success = await rejectRequest(request._id);
    if (success && onActionComplete) {
      onActionComplete();
    }
  };

  return (
    <div className="glass rounded-xl p-4 border border-white/10 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-white truncate">
              {request.displayName}
            </h4>
            <span className="text-muted-foreground text-sm">
              @{request.username}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {request.reason}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(request.createdAt, { addSuffix: true })}
            <span className="mx-1">•</span>
            <span>{request.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isLoading}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-1" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AdminRequestListProps {
  requests: AdminRequest[];
  isLoading: boolean;
}

export function AdminRequestList({ requests, isLoading }: AdminRequestListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 animate-pulse border border-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-3 w-48 bg-white/10 rounded" />
                <div className="h-3 w-24 bg-white/10 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-white/10 rounded" />
                <div className="h-8 w-20 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center border border-white/10">
        <Check className="w-12 h-12 mx-auto text-green-400 mb-4 opacity-50" />
        <p className="text-muted-foreground">No pending requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <AdminRequestCard key={request._id} request={request} />
      ))}
    </div>
  );
}
