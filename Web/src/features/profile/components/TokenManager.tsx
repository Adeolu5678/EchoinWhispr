'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useTokenManager } from '../hooks/useTokenManager';
import { useToast } from '@/hooks/use-toast';

/**
 * TokenManager Component
 *
 * Component for tokenized whisper rewards and tipping functionality.
 * Displays token balance and provides tipping functionality when the feature is enabled.
 */
export const TokenManager: React.FC = () => {
  const { tokenBalance, earnedTokens, rewardTokens, getTokenBalance } = useTokenManager();
  const { toast } = useToast();

  useEffect(() => {
    getTokenBalance('current-user'); // This would be the actual user ID
  }, [getTokenBalance]);

  const handleRewardTokens = async (amount: number, reason: string) => {
    try {
      await rewardTokens('current-user', amount, reason);
      toast({
        title: 'Success',
        description: `${amount} tokens rewarded`,
      });
      getTokenBalance('current-user'); // Refresh balance
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reward tokens',
        variant: 'destructive',
      });
    }
  };

  if (!FEATURE_FLAGS.TOKENIZED_WHISPER_REWARDS_AND_TIPPING) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Token Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{tokenBalance}</div>
          <div className="text-sm text-gray-500">Tokens Available</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{earnedTokens}</div>
          <div className="text-sm text-gray-500">Tokens Earned</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Quick Rewards:</div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRewardTokens(10, 'Quality whisper')}
            >
              +10 (Quality)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRewardTokens(25, 'Engagement boost')}
            >
              +25 (Engagement)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRewardTokens(50, 'Community contribution')}
            >
              +50 (Community)
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">
          Hedera-powered token rewards and tipping
        </div>
      </CardContent>
    </Card>
  );
};