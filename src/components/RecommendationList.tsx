
import React from 'react';
import { Place } from '@/data/places';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Utensils, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RecommendationListProps {
  recommendations: Place[];
  onReset: () => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendations, 
  onReset 
}) => {
  const renderPriceLevel = (price: number) => {
    return Array(4).fill(0).map((_, index) => (
      <span key={index} className={cn(
        "text-sm",
        index < price ? "text-foreground" : "text-muted-foreground opacity-40"
      )}>
        $
      </span>
    ));
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recommended for you</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Start over
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">No recommendations found based on your preferences.</p>
          <Button onClick={onReset}>Try again</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.slice(0, 5).map((place) => (
            <Card key={place.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/place/${place.id}`}>
                <div className="flex h-32">
                  <div className="w-32 h-full">
                    <img 
                      src={place.imageUrl} 
                      alt={place.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-3">
                    <div>
                      <h3 className="font-medium truncate">{place.name}</h3>
                      <div className="flex items-center text-sm space-x-1 mb-1">
                        {place.type === 'hotel' ? 
                          <Hotel size={14} className="text-muted-foreground" /> : 
                          <Utensils size={14} className="text-muted-foreground" />
                        }
                        <span className="capitalize text-muted-foreground">{place.type}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{renderPriceLevel(place.price)}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-sm">{place.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{place.location}</p>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
          
          <div className="pt-2 flex justify-center">
            <Link to="/create-trip-path">
              <Button variant="outline" className="bg-voyage-primary text-white hover:bg-voyage-secondary">
                Create a trip path with these places
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationList;
