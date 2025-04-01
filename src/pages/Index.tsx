
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
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<'hotel' | 'restaurant'>('hotel');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
          description: t('place.saved.description', { name: place.name }),
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
  
  return (
    <div className={`bg-background ${isMobile ? 'mobile-container' : 'max-w-6xl mx-auto p-8'}`}>
      {!isMobile ? (
        // Desktop layout
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-tripadvisor-primary">{t('app.name')}</h1>
            
            {!user ? (
              <Button asChild variant="outline" className="shadow-sm hover:shadow-md transition-shadow">
                <Link to="/auth" className="flex items-center gap-2">
                  <LogIn size={18} />
                  <span>{t('login')}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" className="hover:bg-tripadvisor-light">
                <Link to="/profile">{t('profile')}</Link>
              </Button>
            )}
          </div>
          
          <div className="col-span-4">
            <div className="sticky top-8 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm">
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
        // Mobile layout with padding to account for fixed header and footer
        <>
          <div className="pt-16 pb-16">
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
          </div>
          
          <NavBar />
        </>
      )}
    </div>
  );
};

export default Index;
