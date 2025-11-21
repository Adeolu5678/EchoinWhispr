'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const upgradeToPremium = useMutation(api.subscriptions.upgradeToPremium);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    try {
      await upgradeToPremium({ planId });
      // In a real app, this would redirect to Stripe/etc.
      alert('Successfully upgraded to Premium!');
      onClose();
    } catch (error) {
      console.error('Failed to upgrade:', error);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Unlock exclusive features and support EchoinWhispr.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold text-lg">Monthly Plan</h3>
              <p className="text-gray-500">$4.99/month</p>
              <Button 
                className="w-full mt-4" 
                onClick={() => handleUpgrade('monthly_premium')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Monthly'}
              </Button>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-bold text-lg">Yearly Plan</h3>
              <p className="text-gray-500">$49.99/year</p>
              <Button 
                className="w-full mt-4" 
                onClick={() => handleUpgrade('yearly_premium')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Yearly'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
