'use client';

import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellRing, Loader2 } from 'lucide-react';

export function NotificationSettings() {
  const { permission, requestPermission, isRegistering } = usePushNotifications();

  const isGranted = permission === 'granted';

  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isGranted ? <BellRing className="w-5 h-5 text-primary" /> : <Bell className="w-5 h-5 text-primary" />}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified when you receive new whispers or replies.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-base font-medium">
            {isGranted ? 'Notifications Enabled' : 'Enable Notifications'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isGranted 
              ? 'You are all set to receive alerts.' 
              : 'Allow notifications to stay updated.'}
          </p>
        </div>
        
        {!isGranted && (
          <Button 
            onClick={requestPermission} 
            disabled={isRegistering || permission === 'denied'}
            variant={permission === 'denied' ? "destructive" : "default"}
          >
            {isRegistering ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Bell className="w-4 h-4 mr-2" />
            )}
            {permission === 'denied' ? 'Denied' : 'Enable'}
          </Button>
        )}

        {isGranted && (
          <Button variant="outline" disabled className="text-green-500 border-green-500/20 bg-green-500/10">
            <BellRing className="w-4 h-4 mr-2" />
            Active
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
