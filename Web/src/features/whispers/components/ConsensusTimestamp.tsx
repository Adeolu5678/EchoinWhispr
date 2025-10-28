import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * ConsensusTimestamp Component
 *
 * Placeholder component for displaying and verifying immutable timestamps
 * via Hedera Consensus Service. This component is disabled until the
 * IMMUTABLE_WHISPER_TIMESTAMPING_VIA_CONSENSUS_SERVICE feature flag is enabled.
 *
 * @param whisperId - The ID of the whisper to timestamp
 * @param consensusTimestamp - The consensus timestamp from Hedera (optional)
 * @param consensusHash - The consensus hash for verification (optional)
 */
interface ConsensusTimestampProps {
  whisperId: string;
  consensusTimestamp?: string;
  consensusHash?: string;
}

export const ConsensusTimestamp: React.FC<ConsensusTimestampProps> = ({
  consensusTimestamp,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
      <Badge variant="outline" className="text-xs">
        Consensus Timestamp
      </Badge>

      {consensusTimestamp ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {new Date(consensusTimestamp).toLocaleString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Verify
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Not timestamped
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            Timestamp
          </Button>
        </div>
      )}
    </div>
  );
};