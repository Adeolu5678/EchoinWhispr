'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Eye, EyeOff, Heart, Clock, Check, X, AlertTriangle } from 'lucide-react';
import type { Id } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface UnmaskingCeremonyProps {
  conversationId: Id<'conversations'>;
  otherUsername?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UnmaskingCeremony({ 
  conversationId, 
  otherUsername = 'Anonymous',
  isOpen, 
  onClose 
}: UnmaskingCeremonyProps) {
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<Array<{left: string, top: string, delay: string, char: string}>>([]);
  const isMountedRef = useRef(true);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showConfetti && isMountedRef.current) {
      setConfettiParticles([...Array(20)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        char: ['🎉', '✨', '🎭', '💫', '⭐'][Math.floor(Math.random() * 5)]
      })));
    }
  }, [showConfetti]);

  const status = useQuery(api.unmasking.getUnmaskingStatus, { conversationId });
  const requestUnmasking = useMutation(api.unmasking.requestUnmasking);
  const respondToUnmasking = useMutation(api.unmasking.respondToUnmasking);
  const completeUnmasking = useMutation(api.unmasking.completeUnmasking);
  const cancelRequest = useMutation(api.unmasking.cancelUnmaskingRequest);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      await requestUnmasking({ conversationId });
      if (isMountedRef.current) {
        toast({
          title: "Request sent! 💫",
          description: "They'll be notified of your desire to reveal identities.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (isMountedRef.current) {
        toast({
          title: "Failed to request",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleRespond = async (accept: boolean) => {
    if (!status?.requestId) return;
    setIsLoading(true);
    try {
      await respondToUnmasking({ 
        requestId: status.requestId as Id<'unmaskingRequests'>, 
        accept 
      });
      if (isMountedRef.current) {
        toast({
          title: accept ? "You accepted! 🎉" : "Request declined",
          description: accept ? "The ceremony can now begin!" : "",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (isMountedRef.current) {
        toast({
          title: "Failed to respond",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await completeUnmasking({ conversationId });
      if (isMountedRef.current) {
        setShowConfetti(true);
        confettiTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setShowConfetti(false);
          }
        }, 3000);
        toast({
          title: "🎭 Identities Revealed! 🎭",
          description: "You can now see each other's true identities!",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (isMountedRef.current) {
        toast({
          title: "Failed to complete ceremony",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await cancelRequest({ conversationId });
      if (isMountedRef.current) {
        toast({ title: "Request cancelled" });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (isMountedRef.current) {
        toast({
          title: "Failed to cancel",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const renderContent = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentStatus = status as any; // Cast to any to handle union type property access safely

    switch (currentStatus?.status) {
      case 'completed':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <Eye className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Identities Revealed!</h3>
            <p className="text-muted-foreground mb-4">
              You and {otherUsername} have completed the unmasking ceremony.
            </p>
            <Badge className="bg-green-500/20 text-green-300">
              <Check className="w-3 h-3 mr-1" />
              Ceremony Complete
            </Badge>
          </div>
        );

      case 'mutual_pending':
        return (
          <div className="text-center py-8">
            <div className={cn(
              "w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center",
              !prefersReducedMotion && "animate-pulse"
            )}>
              <Heart className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mutual Interest! 💕</h3>
            <p className="text-muted-foreground mb-4">
              You both want to reveal your identities! Ready to begin the ceremony?
            </p>
            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-gradient-to-r from-accent to-primary hover:from-fuchsia-600 hover:to-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Ceremony
            </Button>
          </div>
        );

      case 'accepted':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Request Accepted</h3>
            <p className="text-muted-foreground mb-4">
              The request was accepted. Ready to complete the ceremony!
            </p>
            <Button 
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-600 to-orange-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Ceremony
            </Button>
          </div>
        );

      case 'pending':
        if (currentStatus?.isRequestor) {
          return (
            <div className="text-center py-8">
              <div className={cn(
                "w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center",
                !prefersReducedMotion && "animate-pulse"
              )}>
                <Clock className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Waiting for Response</h3>
              <p className="text-muted-foreground mb-4">
                Your request has been sent. Waiting for {otherUsername} to respond...
              </p>
              <Button 
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Request
              </Button>
            </div>
          );
        } else {
          return (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <EyeOff className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unmasking Request</h3>
              <p className="text-muted-foreground mb-4">
                {otherUsername} wants to reveal their identity to you. Do you want to unmask?
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => handleRespond(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button 
                  onClick={() => handleRespond(true)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
            </div>
          );
        }

      case 'declined':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Request Declined</h3>
            <p className="text-muted-foreground mb-4">
              The previous request was declined. You can try again later.
            </p>
            <Button 
              onClick={handleRequest}
              disabled={isLoading}
            >
              Try Again
            </Button>
          </div>
        );

      default: // 'none'
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <EyeOff className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">The Unmasking Ceremony</h3>
            <p className="text-muted-foreground mb-4">
              Ready to reveal your true identity to {otherUsername}? This is a special moment 
              that requires mutual consent.
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
              <p className="mb-2">✨ Both parties must agree to unmask</p>
              <p className="mb-2">🎭 Your identity remains hidden until completion</p>
              <p>💫 This action is permanent for this conversation</p>
            </div>
            <Button 
              onClick={handleRequest}
              disabled={isLoading}
              className="bg-gradient-to-r from-accent to-primary hover:from-fuchsia-600 hover:to-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Request Unmasking
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
            Unmasking Ceremony
          </DialogTitle>
          <DialogDescription className="text-center">
            Reveal your true identity
          </DialogDescription>
        </DialogHeader>

        {showConfetti && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {confettiParticles.map((p, i) => (
              <div
                key={i}
                className="absolute text-2xl motion-safe:animate-bounce"
                style={{
                  left: p.left,
                  top: p.top,
                  animationDelay: p.delay,
                }}
              >
                {p.char}
              </div>
            ))}
          </div>
        )}

        {renderContent()}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
