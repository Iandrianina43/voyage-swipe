
import React, { useState } from 'react';
import SwipeCard from './SwipeCard';
import { Place } from '@/data/places';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SwipeContainerProps {
  places: Place[];
  onSwipeRight?: (place: Place) => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ places, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const currentPlace = places[currentIndex];
  const nextPlace = places[currentIndex + 1];
  
  const handleSwipe = (dir: 'left' | 'right') => {
    if (isSwiping || currentIndex >= places.length) return;
    
    setDirection(dir);
    setIsSwiping(true);
    
    if (dir === 'right') {
      // Like action
      if (user && onSwipeRight) {
        onSwipeRight(currentPlace);
      }
      
      toast({
        title: 'Place Saved',
        description: `${currentPlace.name} has been saved to your favorites.`,
      });
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      setIsSwiping(false);
    }, 300);
  };
  
  const getAnimationClass = () => {
    if (!direction) return '';
    return direction === 'right' ? 'animate-card-swipe-right' : 'animate-card-swipe-left';
  };
  
  return (
    <div className="h-[420px] my-8 relative">
      {currentIndex < places.length ? (
        <>
          {/* Current card */}
          <div
            className={`absolute inset-0 ${getAnimationClass()}`}
          >
            <SwipeCard
              place={currentPlace}
              onSwipe={(direction) => handleSwipe(direction)}
              isTop={true}
            />
          </div>
          
          {/* Next card (for peeking) */}
          {nextPlace && (
            <div className="absolute inset-0 scale-[0.98] -rotate-3 -z-10 opacity-70">
              <SwipeCard
                place={nextPlace}
                onSwipe={() => {}}
                isTop={false}
              />
            </div>
          )}
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-6 max-w-xs mx-auto">
            <p className="text-lg font-medium mb-3 text-tripadvisor-primary">
              No more places to show!
            </p>
            <p className="text-muted-foreground mb-4">
              You've seen all {places.length > 0 && places[0].type === 'hotel' ? t('hotels') : t('restaurants')} in this category.
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="bg-tripadvisor-primary hover:bg-tripadvisor-primary/90 text-white px-4 py-2 rounded-full"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeContainer;
