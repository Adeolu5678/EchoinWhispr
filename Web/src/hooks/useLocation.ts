import { useState, useRef, useCallback, useEffect } from 'react';
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

  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(() => {
    const currentRequestId = ++requestIdRef.current;

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
        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
          return;
        }
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
          return;
        }
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
  }, [toast]);

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
};
