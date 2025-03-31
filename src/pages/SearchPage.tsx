
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Hotel, Utensils, Star, ArrowLeft } from 'lucide-react';
import { dummyPlaces, Place } from '@/data/places';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import NavBar from '@/components/NavBar';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Beach resort', 'Italian restaurant', 'New York hotel']);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Add to recent searches
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
    }
    
    // Filter places based on search term
    const filteredResults = dummyPlaces.filter(place => 
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.features.some(feature => 
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    setResults(filteredResults);
  };
  
  const searchFor = (term: string) => {
    setSearchTerm(term);
    
    // Trigger search programmatically
    const filteredResults = dummyPlaces.filter(place => 
      place.name.toLowerCase().includes(term.toLowerCase()) ||
      place.location.toLowerCase().includes(term.toLowerCase()) ||
      place.description.toLowerCase().includes(term.toLowerCase()) ||
      place.features.some(feature => 
        feature.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    setResults(filteredResults);
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={12} 
            className={star <= Math.round(rating) ? "star-filled" : "star-empty"} 
          />
        ))}
        <span className="text-xs ml-1">{rating}</span>
      </div>
    );
  };
  
  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <Link to="/" className="mr-2">
          <ArrowLeft size={20} className="text-tripadvisor-primary" />
        </Link>
        <h1 className="text-lg font-semibold">Search</h1>
      </div>
      
      <div className="px-4 py-4">
        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for hotels, restaurants, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-5 w-full rounded-full border-muted"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1 rounded-full bg-tripadvisor-primary hover:bg-tripadvisor-primary/90 text-white"
          >
            Search
          </Button>
        </form>
        
        {results.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-3">Search Results</h2>
            <div className="grid gap-3">
              {results.map(place => (
                <Link to={`/place/${place.id}`} key={place.id}>
                  <Card className="mobile-card hover:shadow-md transition-shadow">
                    <div className="flex h-24">
                      <div className="w-24 h-full">
                        <img 
                          src={place.imageUrl} 
                          alt={place.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm truncate">{place.name}</h3>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <MapPin size={12} />
                              <span>{place.location}</span>
                            </div>
                            <div className="mt-1">
                              {renderStars(place.rating)}
                            </div>
                          </div>
                          
                          <div className="flex items-center bg-muted rounded-full p-1 px-2">
                            {place.type === 'hotel' ? 
                              <Hotel size={12} className="mr-1" /> : 
                              <Utensils size={12} className="mr-1" />
                            }
                            <span className="text-xs capitalize">{place.type}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
          </div>
        ) : (
          <div>
            <h2 className="text-base font-semibold mb-3">Recent Searches</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {recentSearches.map((term, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="text-xs rounded-full border-tripadvisor-primary/30 text-tripadvisor-primary" 
                  onClick={() => searchFor(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
            
            <h2 className="text-base font-semibold mt-6 mb-3">Popular Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="flex justify-start space-x-2 h-auto py-3 mobile-card border-tripadvisor-light" 
                onClick={() => searchFor('Beachfront')}
              >
                <Hotel size={20} className="text-tripadvisor-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Beachfront Hotels</p>
                  <p className="text-xs text-muted-foreground">Ocean views & more</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start space-x-2 h-auto py-3 mobile-card border-tripadvisor-light" 
                onClick={() => searchFor('Fine dining')}
              >
                <Utensils size={20} className="text-tripadvisor-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Fine Dining</p>
                  <p className="text-xs text-muted-foreground">Upscale experiences</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start space-x-2 h-auto py-3 mobile-card border-tripadvisor-light" 
                onClick={() => searchFor('Spa')}
              >
                <Hotel size={20} className="text-tripadvisor-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Spa Resorts</p>
                  <p className="text-xs text-muted-foreground">Relaxation getaways</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex justify-start space-x-2 h-auto py-3 mobile-card border-tripadvisor-light" 
                onClick={() => searchFor('Pet friendly')}
              >
                <Hotel size={20} className="text-tripadvisor-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Pet Friendly</p>
                  <p className="text-xs text-muted-foreground">Travel with pets</p>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default SearchPage;
