'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api, Id } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Check, 
  Trash2, 
  MessageSquare, 
  Users, 
  Radio, 
  Sparkles,
  Info,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const notificationIcons = {
  whisper: MessageSquare,
  friend_request: Users,
  chamber: Radio,
  resonance: Sparkles,
  system: Info,
};

const notificationColors = {
  whisper: 'from-primary/20 to-accent/20 border-primary/30',
  friend_request: 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/30',
  chamber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  resonance: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  system: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();

  const notificationsData = useQuery(api.notifications.getNotifications, { limit: 10 });
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNotificationClick = async (notification: {
    _id: Id<'notifications'>;
    read: boolean;
    actionUrl?: string;
  }) => {
    try {
      if (!notification.read) {
        await markAsRead({ notificationId: notification._id });
      }
      if (notification.actionUrl) {
        router.push(notification.actionUrl);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: "Failed to mark as read",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: "Failed to mark all as read",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: Id<'notifications'>) => {
    e.stopPropagation();
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({
        title: "Failed to delete notification",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: Id<'notifications'>) => {
    e.stopPropagation();
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast({
        title: "Failed to mark as read",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const notifications = notificationsData?.notifications || [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${(unreadCount ?? 0) > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-controls="notification-dropdown"
        aria-haspopup="dialog"
      >
        <Bell className="w-5 h-5" />
        {(unreadCount ?? 0) > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold",
            !prefersReducedMotion && "animate-pulse"
          )}>
            {unreadCount && unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card id="notification-dropdown" className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass border-white/10 shadow-2xl z-50 overflow-hidden" role="dialog" aria-label="Notifications" aria-modal="true">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs text-muted-foreground hover:text-white"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs mt-1">We&apos;ll notify you when something happens!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => {
                  const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
                  const colorClass = notificationColors[notification.type as keyof typeof notificationColors] || notificationColors.system;

                  return (
                    <div
                      key={notification._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleNotificationClick(notification)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification)}
                      className={`p-3 hover:bg-white/5 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorClass} border flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${!notification.read ? 'text-white' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 flex items-center gap-1">
                            {notification.metadata?.hasImage && (
                              <ImageIcon className="w-3 h-3 flex-shrink-0" />
                            )}
                            <span>{notification.message}</span>
                          </p>
                          {/* Show message count for chamber notifications */}
                          {notification.type === 'chamber' && (notification.metadata?.messageCount ?? 0) > 1 && (
                            <p className="text-[10px] text-amber-400 mt-0.5">
                              {notification.metadata.messageCount > 99 ? '99+' : notification.metadata.messageCount} new messages
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground/60">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                          <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 hover:bg-white/10"
                                  onClick={(e) => handleMarkAsRead(e, notification._id as Id<'notifications'>)}
                                  aria-label="Mark as read"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-red-500/20 hover:text-red-400"
                                onClick={(e) => handleDelete(e, notification._id as Id<'notifications'>)}
                                aria-label="Delete notification"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-white/10 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-white w-full"
                onClick={() => {
                  router.push('/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
