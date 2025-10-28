'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, RotateCcw } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';

interface RomanceSwiperProps {
  personas: Array<{
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    humor?: string;
    career?: string;
    expertise?: string;
  }>;
  onSwipe: (userId: string, action: 'like' | 'dislike') => void;
  onUndo?: () => void;
  remainingSwipes: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * RomanceSwiper component provides Tinder-like swiping interface for romantic connections.
 * Features gesture handling, swipe animations, and daily limit tracking.
 *
 * @param personas - Array of user personas to swipe through
 * @param onSwipe - Callback when user swipes (like/dislike)
 * @param onUndo - Optional callback for undo functionality
 * @param remainingSwipes - Number of remaining swipes for the day
 * @param isLoading - Whether the component is in loading state
 * @param className - Additional CSS classes
 */
export const RomanceSwiper: React.FC<RomanceSwiperProps> = ({
  personas,
  onSwipe,
  onUndo,
  remainingSwipes,
  isLoading = false,
  className = '',
}) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const currentPersona = personas[currentIndex];
  const hasReachedLimit = remainingSwipes <= 0;

  const handleSwipe = useCallback(async (action: 'like' | 'dislike') => {
    if (!currentPersona || isAnimating || hasReachedLimit) return;

    if (!FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE) {
      toast({
        title: 'Feature not available',
        description: 'Romantic swiping is not yet available.',
        variant: 'destructive',
      });
      return;
    }

    // Check if mutual matching is enabled - if so, swipes create pending interests instead of immediate matches
    if (FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && action === 'like') {
      toast({
        title: 'Interest expressed!',
        description: 'Your interest has been recorded. A match will be created if they feel the same way.',
        variant: 'default',
      });
    }

    setIsAnimating(true);

    try {
      await onSwipe(currentPersona.id, action);
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Swipe failed:', error);
      toast({
        title: 'Swipe failed',
        description: 'Failed to record your swipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnimating(false);
    }
  }, [currentPersona, isAnimating, hasReachedLimit, onSwipe, toast]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating || hasReachedLimit) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isAnimating) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isAnimating) return;

    const { x } = dragOffset;
    const threshold = 100;

    if (Math.abs(x) > threshold) {
      const action = x > 0 ? 'like' : 'dislike';
      handleSwipe(action);
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [isDragging, isAnimating, dragOffset, handleSwipe]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating || hasReachedLimit) return;
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimating) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || isAnimating) return;

    const { x } = dragOffset;
    const threshold = 100;

    if (Math.abs(x) > threshold) {
      const action = x > 0 ? 'like' : 'dislike';
      handleSwipe(action);
    }

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, handleMouseUp]);

  if (!FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE) {
    return (
      <Card className={`opacity-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Romantic Connections</h3>
          <p className="text-muted-foreground">
            Swipe through personas to find romantic connections. Coming soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (hasReachedLimit) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Daily Limit Reached</h3>
          <p className="text-muted-foreground mb-4">
            You&apos;ve reached your daily swipe limit of 10. Upgrade to unlimited swipes!
          </p>
          <Badge variant="secondary">0 swipes remaining</Badge>
        </CardContent>
      </Card>
    );
  }

  if (!currentPersona) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No More Personas</h3>
          <p className="text-muted-foreground">
            Check back later for more romantic connections!
          </p>
        </CardContent>
      </Card>
    );
  }

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.8, 1 - Math.abs(dragOffset.x) / 300);

  return (
    <div className={`relative ${className}`}>
      {/* Swipe limit indicator */}
      <div className="flex justify-center mb-4">
        <Badge variant="outline" className="text-sm">
          {remainingSwipes} swipes remaining today
        </Badge>
      </div>

      {/* Card container */}
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
        <div
          ref={cardRef}
          className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-transform duration-200 ${
            isDragging ? 'scale-105' : ''
          }`}
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
            opacity,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <PersonaCard user={currentPersona} className="h-full" />
        </div>

        {/* Like/Dislike overlays */}
        {Math.abs(dragOffset.x) > 50 && (
          <>
            {dragOffset.x > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-2xl rotate-12 border-4 border-white">
                  LIKE
                </div>
              </div>
            )}
            {dragOffset.x < 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-2xl -rotate-12 border-4 border-white">
                  NOPE
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 p-0 border-red-200 hover:border-red-300 hover:bg-red-50"
          onClick={() => handleSwipe('dislike')}
          disabled={isLoading || isAnimating}
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>

        {onUndo && currentIndex > 0 && (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            onClick={onUndo}
            disabled={isLoading}
          >
            <RotateCcw className="w-6 h-6 text-gray-500" />
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-14 h-14 p-0 border-green-200 hover:border-green-300 hover:bg-green-50"
          onClick={() => handleSwipe('like')}
          disabled={isLoading || isAnimating}
        >
          <Heart className="w-6 h-6 text-green-500" />
        </Button>
      </div>
    </div>
  );
};