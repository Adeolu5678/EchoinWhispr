import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRegistering, setIsRegistering] = useState(false);
  const registerPushToken = useMutation(api.users.registerPushToken);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await registerToken();
      } else {
        toast({
          title: "Permission Denied",
          description: "You need to enable notifications to receive alerts.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const registerToken = async () => {
    setIsRegistering(true);
    try {
      // In a real app, we would get the token from FCM or VAPID here.
      // For this MVP/Demo, we'll generate a mock token if one doesn't exist.
      // This simulates the process of getting a token from a provider.
      const mockToken = `web-push-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      await registerPushToken({ token: mockToken });
      
      toast({
        title: "Notifications Enabled",
        description: "You will now receive alerts for new whispers.",
      });
    } catch (error) {
      console.error("Failed to register push token:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register for push notifications.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    permission,
    requestPermission,
    isRegistering,
  };
};
