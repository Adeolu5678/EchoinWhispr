/**
 * Skeleton loading components for improved perceived performance.
 * These provide visual feedback while data is loading.
 */

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with pulse animation.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        className
      )}
    />
  );
}

/**
 * Skeleton for WhisperCard component.
 */
export function WhisperCardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      {/* Header with avatar and meta */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for FriendCard component.
 */
export function FriendCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for ConversationCard component.
 */
export function ConversationCardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for MessageBubble component.
 */
export function MessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full" />}
      <div className={cn('max-w-[70%] space-y-2', isOwn ? 'items-end' : 'items-start')}>
        <Skeleton className={cn('h-16 w-48 rounded-xl', isOwn ? 'rounded-br-none' : 'rounded-bl-none')} />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/**
 * Skeleton for ProfileCard component.
 */
export function ProfileSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-6">
      {/* Avatar and name */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex justify-center gap-8">
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-12 mx-auto" />
        </div>
      </div>
      
      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Action button */}
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
}

/**
 * List of skeleton cards for loading states.
 */
export function WhisperListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <WhisperCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FriendListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <FriendCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ConversationListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ConversationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MessageListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <MessageSkeleton key={i} isOwn={i % 2 === 0} />
      ))}
    </div>
  );
}
