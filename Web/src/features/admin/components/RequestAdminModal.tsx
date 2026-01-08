'use client';

import { useState } from 'react';
import { Shield, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAdminActions } from '../hooks/useAdminActions';
import { useAdminData } from '../hooks/useAdminData';

interface RequestAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestAdminModal({ open, onOpenChange }: RequestAdminModalProps) {
  const [reason, setReason] = useState('');
  const { requestPromotion, isLoading } = useAdminActions();
  const { myRequestStatus } = useAdminData();

  const handleSubmit = async () => {
    const success = await requestPromotion(reason);
    if (success) {
      setReason('');
      onOpenChange(false);
    }
  };

  const hasPendingRequest = myRequestStatus?.status === 'pending';
  const wasRejected = myRequestStatus?.status === 'rejected';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Request Admin Access
          </DialogTitle>
          <DialogDescription>
            Admin privileges allow you to monitor all whispers and see sender/recipient details.
            Your request will be reviewed by a super admin.
          </DialogDescription>
        </DialogHeader>

        {hasPendingRequest ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-white font-medium mb-2">Request Pending</p>
            <p className="text-sm text-muted-foreground">
              Your admin request is currently being reviewed.
              You&apos;ll be notified when it&apos;s processed.
            </p>
          </div>
        ) : wasRejected ? (
          <div className="space-y-4 py-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              Your previous request was rejected. You may submit a new request with more details.
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Why do you need admin access?
              </label>
              <Textarea
                placeholder="Explain your reason for requesting admin privileges..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Why do you need admin access?
              </label>
              <Textarea
                placeholder="Explain your reason for requesting admin privileges..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!hasPendingRequest && (
            <Button
              onClick={handleSubmit}
              disabled={reason.trim().length < 10 || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Request
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
