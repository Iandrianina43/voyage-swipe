
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import CategorySelector from '@/components/CategorySelector';
import SwipeContainer from '@/components/SwipeContainer';
import { dummyPlaces, Place } from '@/data/places';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<'hotel' | 'restaurant'>('hotel');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  
  useEffect(() => {
    // Filter places based on the active category
    const places = dummyPlaces.filter(place => place.type === activeCategory);
    setFilteredPlaces(places);
  }, [activeCategory]);
  
  return (
    <div className="mobile-container bg-background">
      <div className="mobile-header justify-center">
        <h1 className="text-xl font-bold text-tripadvisor-primary">Mi Voyage</h1>
      </div>
      
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2 text-center">Discover & Explore</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Find amazing {activeCategory === 'hotel' ? 'hotels' : 'restaurants'} with a swipe
        </p>
        
        <CategorySelector 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <SwipeContainer places={filteredPlaces} />
      </div>
      
      <NavBar />
    </div>
  );
};

export default Index;
