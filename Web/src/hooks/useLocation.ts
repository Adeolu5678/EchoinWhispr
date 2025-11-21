import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by your browser';
      setError(msg);
      setIsLoading(false);
      toast({
        title: 'Location Error',
        description: msg,
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        let msg = 'Unable to retrieve your location';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable';
        } else if (err.code === err.TIMEOUT) {
          msg = 'The request to get user location timed out';
        }
        
        setError(msg);
        setIsLoading(false);
        toast({
          title: 'Location Error',
          description: msg,
          variant: 'destructive',
        });
      }
    );
  };

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
};
