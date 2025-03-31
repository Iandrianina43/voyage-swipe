
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyPlaces } from '@/data/places';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, MapPin, Hotel, Restaurant } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const place = dummyPlaces.find(p => p.id === id);
  
  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Place not found</h2>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }
  
  const handleSave = () => {
    toast({
      title: "Added to favorites",
      description: `${place.name} has been saved to your favorites.`,
      duration: 2000,
    });
  };
  
  const renderPriceLevel = (price: number) => {
    return Array(4).fill(0).map((_, index) => (
      <span key={index} className={index < price ? "text-foreground" : "text-muted-foreground opacity-40"}>
        $
      </span>
    ));
  };
  
  const TypeIcon = place.type === 'hotel' ? Hotel : Restaurant;
  
  return (
    <div className="pb-16">
      <div className="relative h-[40vh]">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={handleSave}
        >
          <Heart size={20} />
        </Button>
      </div>
      
      <div className="container px-4 -mt-16 relative">
        <div className="bg-card rounded-t-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{place.name}</h1>
              <div className="flex items-center text-sm space-x-2 mb-2">
                <TypeIcon size={16} className="text-muted-foreground" />
                <span className="capitalize">{place.type}</span>
                <span>•</span>
                <span>{renderPriceLevel(place.price)}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{place.rating}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <MapPin size={14} className="mr-1" />
                <span>{place.location}</span>
              </div>
              <span className="text-sm text-muted-foreground">{place.distance}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{place.description}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Features</h2>
              <div className="flex flex-wrap gap-2">
                {place.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">{feature}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button className="w-full bg-voyage-primary hover:bg-voyage-secondary">
              {place.type === 'hotel' ? 'Book a Room' : 'Make a Reservation'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
