'use client';

/**
 * Component to display the unread count badge
 */
interface UnreadCountBadgeProps {
  unreadCount: number;
}

export function UnreadCountBadge({ unreadCount }: UnreadCountBadgeProps) {
  if (unreadCount === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
        No unread
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
      {unreadCount} unread
    </span>
  );
}