
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyPlaces, Place } from '@/data/places';
import { Heart, Star, Hotel, Utensils, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSavedPlaces = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get saved place IDs from Supabase
        const { data: savedData, error } = await supabase
          .from('saved_places')
          .select('place_id')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (savedData && savedData.length > 0) {
          // Get the actual place objects from dummy data using the saved IDs
          const placeIds = savedData.map(item => item.place_id);
          const places = dummyPlaces.filter(place => placeIds.includes(place.id));
          setSavedPlaces(places);
        } else {
          setSavedPlaces([]);
        }
      } catch (error) {
        console.error("Error fetching saved places:", error);
        toast({
          title: "Error",
          description: "Failed to load saved places",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedPlaces();
  }, [user, toast]);
  
  const handleRemove = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_places')
        .delete()
        .eq('user_id', user.id)
        .eq('place_id', id);
      
      if (error) throw error;
      
      setSavedPlaces(prev => prev.filter(place => place.id !== id));
      
      toast({
        title: "Removed from favorites",
        description: "The place has been removed from your favorites.",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error removing place:", error);
      toast({
        title: "Error",
        description: "Failed to remove place",
        variant: "destructive",
      });
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= Math.round(rating) ? "star-filled" : "star-empty"} 
          />
        ))}
        <span className="text-sm ml-1">{rating}</span>
      </div>
    );
  };

  useEffect(() => {
    // If the user is not logged in, redirect to auth page
    if (!user && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your saved places",
      });
      navigate('/auth');
    }
  }, [user, isLoading, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="mobile-container">
        <div className="mobile-header">
          <Link to="/" className="mr-2">
            <ArrowLeft size={20} className="text-tripadvisor-primary" />
          </Link>
          <h1 className="text-lg font-semibold">{t('saved.places')}</h1>
        </div>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tripadvisor-primary"></div>
        </div>
        <NavBar />
      </div>
    );
  }
  
  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <Link to="/" className="mr-2">
          <ArrowLeft size={20} className="text-tripadvisor-primary" />
        </Link>
        <h1 className="text-lg font-semibold">{t('saved.places')}</h1>
      </div>
      
      <div className="px-4 py-4">
        {savedPlaces.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-tripadvisor-light flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-tripadvisor-primary" />
            </div>
            <h2 className="text-lg font-medium mb-2">{t('no.saved.places')}</h2>
            <p className="text-muted-foreground mb-4 max-w-xs">
              {t('swipe.right.save')}
            </p>
            <Button asChild className="bg-tripadvisor-primary hover:bg-tripadvisor-primary/90">
              <Link to="/">{t('discover.places')}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {savedPlaces.map(place => (
              <Card key={place.id} className="mobile-card overflow-hidden border-border">
                <div className="flex h-32">
                  <div className="w-1/3 h-full">
                    <img 
                      src={place.imageUrl} 
                      alt={place.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium truncate">{place.name}</h3>
                        <div className="flex items-center text-xs space-x-1 mb-1">
                          {place.type === 'hotel' ? 
                            <Hotel size={14} className="text-muted-foreground" /> : 
                            <Utensils size={14} className="text-muted-foreground" />
                          }
                          <span className="capitalize text-muted-foreground">{place.type}</span>
                        </div>
                        <div className="mb-1">
                          {renderStars(place.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground">{place.location}</p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-tripadvisor-accent"
                        onClick={() => handleRemove(place.id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <Link 
                        to={`/place/${place.id}`} 
                        className="text-xs font-medium text-tripadvisor-primary hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default SavedPlaces;
