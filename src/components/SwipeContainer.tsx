
import React, { useState, useEffect } from 'react';
import SwipeCard from './SwipeCard';
import { Place } from '@/data/places';
import { toast } from '@/components/ui/use-toast';
import RecommendationList from './RecommendationList';

interface SwipeContainerProps {
  places: Place[];
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [disliked, setDisliked] = useState<Set<string>>(new Set());
  const [showRecommendations, setShowRecommendations] = useState(false);

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
      } else {
        const newDisliked = new Set(disliked);
        newDisliked.add(id);
        setDisliked(newDisliked);
      }
      
      const nextIndex = currentIndex + 1;
      if (nextIndex >= places.length) {
        // When all cards are swiped, show recommendations
        setShowRecommendations(true);
      }
      setCurrentIndex(nextIndex);
    }, 300);
  };

  // Reset state when places change (e.g., category change)
  useEffect(() => {
    setCurrentIndex(0);
    setShowRecommendations(false);
  }, [places]);

  const getRecommendedPlaces = () => {
    if (liked.size === 0) return places; // If nothing liked, return all places
    
    const likedPlacesData = places.filter(place => liked.has(place.id));
    const activeCategory = places[0]?.type || 'hotel';
    
    // Find features that the user liked
    const likedFeatures = new Set<string>();
    likedPlacesData.forEach(place => {
      place.features.forEach(feature => likedFeatures.add(feature));
    });
    
    // Filter places based on liked features
    return places
      .filter(place => !disliked.has(place.id) && !liked.has(place.id))
      .sort((a, b) => {
        const aMatches = a.features.filter(f => likedFeatures.has(f)).length;
        const bMatches = b.features.filter(f => likedFeatures.has(f)).length;
        return bMatches - aMatches; // Sort by number of matching features
      });
  };

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">No places found.</p>
      </div>
    );
  }

  if (showRecommendations) {
    return (
      <RecommendationList 
        recommendations={getRecommendedPlaces()} 
        onReset={() => {
          setCurrentIndex(0);
          setShowRecommendations(false);
        }} 
      />
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
      {currentIndex >= places.length && !showRecommendations && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card p-6 text-center animate-fade-in">
          <h3 className="text-xl font-bold mb-2">You've seen all places!</h3>
          <p className="text-muted-foreground mb-4">Based on your preferences, we have some recommendations for you.</p>
          <button 
            className="text-voyage-primary hover:underline"
            onClick={() => setShowRecommendations(true)}
          >
            View recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default SwipeContainer;
