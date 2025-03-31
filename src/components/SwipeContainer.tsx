
import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Place } from '@/data/places';
import { toast } from '@/components/ui/use-toast';

interface SwipeContainerProps {
  places: Place[];
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    setTimeout(() => {
      if (direction === 'right') {
        const newLiked = new Set(liked);
        newLiked.add(id);
        setLiked(newLiked);
        toast({
          title: "Added to favorites",
          description: `${places[currentIndex].name} has been saved to your favorites.`,
          duration: 2000,
        });
      }
      setCurrentIndex(prev => (prev + 1) % places.length);
    }, 300);
  };

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No places found.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full max-w-md mx-auto">
      {places.map((place, index) => {
        // Only render the current card and the next card for performance
        if (index < currentIndex || index > currentIndex + 1) return null;
        
        const isCurrentCard = index === currentIndex;
        
        return (
          <SwipeCard
            key={place.id}
            place={place}
            onSwipe={handleSwipe}
            isTop={isCurrentCard}
          />
        );
      })}
      
      {/* Rendering complete message when all cards are swiped */}
      {currentIndex >= places.length && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card p-6 text-center animate-fade-in">
          <h3 className="text-xl font-bold mb-2">You've seen all places!</h3>
          <p className="text-muted-foreground mb-4">Pull down to refresh and see more, or check out your saved places.</p>
          <button 
            className="text-voyage-primary hover:underline"
            onClick={() => setCurrentIndex(0)}
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeContainer;
