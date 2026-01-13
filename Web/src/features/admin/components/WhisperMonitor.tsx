'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Calendar, Mic, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useWhisperDetails } from '../hooks/useAdminData';

interface Whisper {
  _id: string;
  content: string;
  createdAt: number;
  isRead: boolean;
  readAt?: number;
  senderUsername: string;
  recipientUsername: string;
  senderId: string;
  recipientId: string;
  isMystery?: boolean;
  isScheduled?: boolean;
  hasAudio: boolean;
}

interface WhisperMonitorProps {
  whispers: Whisper[];
  isLoading: boolean;
}

export function WhisperMonitor({ whispers, isLoading }: WhisperMonitorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-xl p-4 animate-pulse border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="h-4 w-32 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (whispers.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center border border-white/10">
        <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">No whispers to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground font-medium">
        <div className="col-span-2">Time</div>
        <div className="col-span-2">From</div>
        <div className="col-span-2">To</div>
        <div className="col-span-4">Preview</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Whisper rows */}
      {whispers.map((whisper) => (
        <WhisperRow
          key={whisper._id}
          whisper={whisper}
          isExpanded={expandedId === whisper._id}
          onToggle={() => setExpandedId(expandedId === whisper._id ? null : whisper._id)}
        />
      ))}
    </div>
  );
}

interface WhisperRowProps {
  whisper: Whisper;
  isExpanded: boolean;
  onToggle: () => void;
}

function WhisperRow({ whisper, isExpanded, onToggle }: WhisperRowProps) {
  const { details, isLoading: detailsLoading } = useWhisperDetails(
    isExpanded ? whisper._id : null
  );

  const truncatedContent = whisper.content.length > 50
    ? whisper.content.slice(0, 50) + '...'
    : whisper.content;

  return (
    <div className="glass rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
      {/* Main row */}
      <div
        className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="col-span-2 text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          {formatDistanceToNow(whisper.createdAt, { addSuffix: true })}
        </div>
        <div className="col-span-2">
          <span className="text-primary font-medium">@{whisper.senderUsername}</span>
        </div>
        <div className="col-span-2">
          <span className="text-white/80">@{whisper.recipientUsername}</span>
        </div>
        <div className="col-span-4 flex items-center gap-2">
          {whisper.hasAudio && (
            <Mic className="w-4 h-4 text-purple-400 shrink-0" />
          )}
          {whisper.isMystery && (
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
              Mystery
            </span>
          )}
          <span className="text-white/70 truncate">{truncatedContent}</span>
        </div>
        <div className="col-span-2 flex items-center justify-end gap-2">
          {whisper.isRead ? (
            <Eye className="w-4 h-4 text-green-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
          <Button variant="ghost" size="sm" className="p-1">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/10 bg-white/5">
          {detailsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-16 bg-white/5 rounded-lg" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-white/5 rounded-lg" />
                <div className="h-20 bg-white/5 rounded-lg" />
              </div>
            </div>
          ) : details ? (
            <div className="space-y-4">
              {/* Full message */}
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-xs text-muted-foreground mb-2 font-medium">
                  FULL MESSAGE
                </h4>
                <p className="text-white">{details.whisper.content}</p>
              </div>

              {/* Sender & Recipient info */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sender */}
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="text-xs text-primary mb-2 font-medium">SENDER</h4>
                  {details.sender ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-white font-medium">
                        {details.sender.displayName || details.sender.username}
                      </p>
                      <p className="text-muted-foreground">@{details.sender.username}</p>
                      <p className="text-muted-foreground text-xs">{details.sender.email}</p>
                      {details.sender.career && (
                        <p className="text-muted-foreground text-xs">
                          Career: {details.sender.career}
                        </p>
                      )}
                      {details.sender.isDeleted && (
                        <span className="text-red-400 text-xs">Account Deleted</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">User not found</p>
                  )}
                </div>

                {/* Recipient */}
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <h4 className="text-xs text-cyan-400 mb-2 font-medium">RECIPIENT</h4>
                  {details.recipient ? (
                    <div className="space-y-1 text-sm">
                      <p className="text-white font-medium">
                        {details.recipient.displayName || details.recipient.username}
                      </p>
                      <p className="text-muted-foreground">@{details.recipient.username}</p>
                      <p className="text-muted-foreground text-xs">{details.recipient.email}</p>
                      {details.recipient.career && (
                        <p className="text-muted-foreground text-xs">
                          Career: {details.recipient.career}
                        </p>
                      )}
                      {details.recipient.isDeleted && (
                        <span className="text-red-400 text-xs">Account Deleted</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">User not found</p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span>
                  Sent: {new Date(details.whisper.createdAt).toLocaleString()}
                </span>
                {details.whisper.isRead && details.whisper.readAt && (
                  <span className="text-green-400">
                    Read: {new Date(details.whisper.readAt).toLocaleString()}
                  </span>
                )}
                {!details.whisper.isRead && (
                  <span className="text-amber-400">Not read yet</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Failed to load details</p>
          )}
        </div>
      )}
    </div>
  );
}
