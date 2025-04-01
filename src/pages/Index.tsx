
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import CategorySelector from '@/components/CategorySelector';
import SwipeContainer from '@/components/SwipeContainer';
import { dummyPlaces, Place } from '@/data/places';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<'hotel' | 'restaurant'>('hotel');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  
  useEffect(() => {
    // Filter places based on the active category
    const places = dummyPlaces.filter(place => place.type === activeCategory);
    setFilteredPlaces(places);
  }, [activeCategory]);
  
  const handleSwipeRight = async (place: Place) => {
    if (user) {
      try {
        // Save the liked place to the database
        await supabase.from('saved_places').insert({
          user_id: user.id,
          place_id: place.id
        });
      } catch (error) {
        console.error("Error saving place:", error);
      }
    }
  };
  
  return (
    <div className="mobile-container bg-background">
      <div className="mobile-header justify-center">
        <h1 className="text-xl font-bold text-tripadvisor-primary">{t('app.name')}</h1>
        
        {!user && (
          <div className="absolute right-4">
            <Button asChild size="sm" variant="ghost">
              <Link to="/auth" className="flex items-center gap-1">
                <LogIn size={16} />
                <span className="hidden sm:inline">{t('login')}</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-2 text-center">{t('discover')}</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          {t('discover.subtitle')}
        </p>
        
        <CategorySelector 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <SwipeContainer 
          places={filteredPlaces} 
          onSwipeRight={handleSwipeRight}
        />
      </div>
      
      <NavBar />
    </div>
  );
};

export default Index;
