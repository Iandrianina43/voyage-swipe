
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dummyPlaces, Place } from '@/data/places';
import { Heart, Star, Hotel, Restaurant } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const { toast } = useToast();
  
  // For demo purposes, we're showing a few random places as saved
  useEffect(() => {
    // In a real app, this would come from localStorage or a database
    const randomSavedPlaces = dummyPlaces
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setSavedPlaces(randomSavedPlaces);
  }, []);
  
  const handleRemove = (id: string) => {
    setSavedPlaces(prev => prev.filter(place => place.id !== id));
    
    toast({
      title: "Removed from favorites",
      description: "The place has been removed from your favorites.",
      duration: 2000,
    });
  };
  
  const renderPriceLevel = (price: number) => {
    return Array(4).fill(0).map((_, index) => (
      <span key={index} className={
        index < price ? "text-foreground" : "text-muted-foreground opacity-40"
      }>
        $
      </span>
    ));
  };
  
  return (
    <div className="container px-4 py-20 pt-24">
      <h1 className="text-2xl font-bold mb-6">Your Saved Places</h1>
      
      {savedPlaces.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No saved places yet</h2>
          <p className="text-muted-foreground mb-4">
            Swipe right on places you love to save them here.
          </p>
          <Button asChild>
            <Link to="/">Discover Places</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedPlaces.map(place => (
            <Card key={place.id} className="overflow-hidden">
              <div className="flex h-36">
                <div className="w-36 h-full">
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
                      <div className="flex items-center text-sm space-x-1 mb-1">
                        {place.type === 'hotel' ? 
                          <Hotel size={14} className="text-muted-foreground" /> : 
                          <Restaurant size={14} className="text-muted-foreground" />
                        }
                        <span className="capitalize text-muted-foreground">{place.type}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{renderPriceLevel(place.price)}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm">{place.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{place.location}</p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(place.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-center">
                    <Link 
                      to={`/place/${place.id}`} 
                      className="text-sm text-voyage-primary hover:underline"
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
  );
};

export default SavedPlaces;
