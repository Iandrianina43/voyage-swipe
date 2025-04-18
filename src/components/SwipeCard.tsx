
import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, Star } from 'lucide-react';
import { Place } from '@/data/places';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeCardProps {
  place: Place;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ place, onSwipe, isTop }) => {
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const handleSwipe = (direction: 'left' | 'right') => {
    if (!isTop) return;
    setSwipeAnimation(direction);
    setTimeout(() => {
      onSwipe(direction);
    }, 50);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTop) return;
    
    // For mouse events, only start dragging on mouse down
    if ('button' in e && e.button !== 0) return; // Only left mouse button
    
    isDragging.current = true;
    startX.current = 'touches' in e 
      ? e.touches[0].clientX 
      : e.clientX;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
      cardRef.current.classList.add('swiping');
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTop || !isDragging.current || !cardRef.current) return;
    
    const clientX = 'touches' in e 
      ? e.touches[0].clientX 
      : e.clientX;
    
    currentX.current = clientX - startX.current;
    
    if (cardRef.current) {
      const rotation = currentX.current * 0.03;
      cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotation}deg)`;
      
      // Fade in the appropriate button based on swipe direction
      if (currentX.current > 80) {
        cardRef.current.style.boxShadow = '0 0 20px rgba(74, 222, 128, 0.5)';
      } else if (currentX.current < -80) {
        cardRef.current.style.boxShadow = '0 0 20px rgba(248, 113, 113, 0.5)';
      } else {
        cardRef.current.style.boxShadow = '';
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isTop || !cardRef.current) return;
    
    cardRef.current.classList.remove('swiping');
    
    if (isDragging.current) {
      cardRef.current.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      
      if (currentX.current > 100) {
        handleSwipe('right');
      } else if (currentX.current < -100) {
        handleSwipe('left');
      } else {
        cardRef.current.style.transform = '';
        cardRef.current.style.boxShadow = '';
      }
    }
    
    isDragging.current = false;
  };
  
  // Add listeners for mouse events outside the component
  useEffect(() => {
    if (!isTop) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      handleTouchMove(e as unknown as React.MouseEvent);
    };
    
    const handleMouseUp = () => {
      handleTouchEnd();
    };
    
    if (isTop) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTop]);
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if it wasn't a drag attempt and not during animation
    if (!swipeAnimation && Math.abs(currentX.current) < 5 && !isDragging.current) {
      navigate(`/place/${place.id}`);
    }
  };

  const renderPriceLevel = (price: number) => {
    return Array(4).fill(0).map((_, index) => (
      <span key={index} className={cn(
        "text-sm",
        index < price ? "text-foreground" : "text-muted-foreground opacity-40"
      )}>
        €
      </span>
    ));
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "swipe-card w-full rounded-2xl overflow-hidden shadow-lg bg-card",
        isTop ? "z-10" : "z-0",
        swipeAnimation === 'right' && "animate-card-swipe-right",
        swipeAnimation === 'left' && "animate-card-swipe-left"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove as any}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-[3/4]">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white p-4">
          <h3 className="text-xl font-bold mb-1">{place.name}</h3>
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-medium">{place.rating}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{renderPriceLevel(place.price)}</span>
          </div>
          <p className="text-sm opacity-90">{place.location}</p>
          <p className="text-sm opacity-75">{place.distance}</p>
        </div>

        {/* Like/Dislike buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-12 w-12 shadow-lg pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleSwipe('left');
            }}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/90 text-green-500 hover:bg-green-50 hover:text-green-600 rounded-full h-12 w-12 shadow-lg pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleSwipe('right');
            }}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
