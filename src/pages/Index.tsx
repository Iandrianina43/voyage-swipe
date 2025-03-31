
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
    <div className="min-h-screen bg-background pb-16">
      <NavBar />
      <div className="container px-4 py-20 pt-24">
        <h1 className="text-3xl font-bold mb-2 text-center">Mi Voyage</h1>
        <p className="text-center text-muted-foreground mb-6">
          Discover amazing {activeCategory === 'hotel' ? 'hotels' : 'restaurants'} with a swipe
        </p>
        
        <CategorySelector 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <SwipeContainer places={filteredPlaces} />
      </div>
    </div>
  );
};

export default Index;
