
import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Place } from '@/data/places';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
        title: t('place.saved'),
        description: t('place.saved.description', { name: currentPlace.name }),
      });
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
      setIsSwiping(false);
    }, 300);
  };
  
  const resetCards = () => {
    setCurrentIndex(0);
  };
  
  return (
    <div className={`my-8 relative ${isMobile ? 'h-[420px]' : 'h-[500px]'}`}>
      {currentIndex < places.length ? (
        <>
          {/* Current card */}
          <div className="absolute inset-0">
            <SwipeCard
              place={currentPlace}
              onSwipe={(direction) => handleSwipe(direction)}
              isTop={true}
            />
          </div>
          
          {/* Next card (for peeking) */}
          {nextPlace && (
            <div className={`absolute inset-0 ${isMobile ? 'scale-[0.98] -rotate-3' : 'scale-[0.97] -rotate-2'} -z-10 opacity-70`}>
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
          <div className="text-center p-6 max-w-xs mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
            <p className="text-lg font-medium mb-3 text-tripadvisor-primary">
              {t('no.more.places')}
            </p>
            <p className="text-muted-foreground mb-4">
              {t('seen.all.places', { type: places.length > 0 && places[0].type === 'hotel' ? t('hotels') : t('restaurants') })}
            </p>
            <Button
              onClick={resetCards}
              className="flex items-center gap-2 bg-tripadvisor-primary hover:bg-tripadvisor-primary/90 text-white px-4 py-2 rounded-full"
            >
              <RotateCcw size={16} />
              {t('start.over')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeContainer;
