
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
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<'hotel' | 'restaurant'>('hotel');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    // Filter places based on the active category
    const places = dummyPlaces.filter(place => place.type === activeCategory);
    setFilteredPlaces(places);
  }, [activeCategory]);
  
  const handleSwipeRight = async (place: Place) => {
    if (user) {
      try {
        // Save the liked place to the database
        const { error } = await supabase
          .from('saved_places')
          .insert({
            user_id: user.id,
            place_id: place.id
          });
          
        if (error) throw error;
        
        toast({
          title: t('place.saved'),
          description: `${place.name} ${t('place.saved.description')}`,
        });
      } catch (error: any) {
        console.error("Error saving place:", error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: error.message || t('error.unknown'),
        });
      }
    }
  };
  
  // Return different layouts based on screen size
  const isDesktop = window.innerWidth >= 768;
  
  return (
    <div className={`bg-background ${isDesktop ? 'max-w-6xl mx-auto p-8' : 'mobile-container'}`}>
      {isDesktop ? (
        // Desktop layout
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-tripadvisor-primary">{t('app.name')}</h1>
            
            {!user ? (
              <Button asChild variant="outline">
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn size={18} />
                  <span>{t('login')}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link to="/profile">{t('profile')}</Link>
              </Button>
            )}
          </div>
          
          <div className="col-span-4">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4">{t('discover')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('discover.subtitle')}
              </p>
              
              <CategorySelector 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
          
          <div className="col-span-8">
            <SwipeContainer 
              places={filteredPlaces} 
              onSwipeRight={handleSwipeRight}
            />
          </div>
        </div>
      ) : (
        // Mobile layout
        <>
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
        </>
      )}
    </div>
  );
};

export default Index;
