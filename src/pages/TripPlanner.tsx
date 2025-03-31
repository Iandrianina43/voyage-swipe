
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPlaces, Place } from '@/data/places';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon, Hotel, Utensils, MapPin, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define Trip interface
interface TripStop {
  day: number;
  placeId: string;
  notes: string;
}

interface Trip {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  stops: TripStop[];
}

const TripPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize with random recommended places (in a real app, this would come from saved preferences)
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>(() => {
    return dummyPlaces.slice(0, 4);
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  
  // Trip state
  const [trip, setTrip] = useState<Trip>({
    name: 'My Trip',
    startDate: undefined,
    endDate: undefined,
    stops: []
  });
  
  // Search places
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    // Simple search through all places
    const results = dummyPlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.location.toLowerCase().includes(query.toLowerCase()) ||
      place.features.some(f => f.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
  };
  
  // Add place to trip
  const addPlaceToTrip = (place: Place) => {
    if (selectedPlaces.find(p => p.id === place.id)) {
      toast({
        title: "Already added",
        description: `${place.name} is already in your trip`,
        duration: 2000,
      });
      return;
    }
    
    setSelectedPlaces(prev => [...prev, place]);
    setSearchQuery('');
    setSearchResults([]);
    
    toast({
      title: "Place added",
      description: `${place.name} has been added to your trip`,
      duration: 2000,
    });
  };
  
  // Remove place from trip
  const removePlaceFromTrip = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId));
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.filter(stop => stop.placeId !== placeId)
    }));
  };
  
  // Organize trip by adding a place to a specific day
  const addToDay = (placeId: string, day: number) => {
    // Check if this place is already assigned to this day
    const existingStop = trip.stops.find(
      stop => stop.placeId === placeId && stop.day === day
    );
    
    if (existingStop) {
      toast({
        title: "Already scheduled",
        description: `This place is already scheduled for Day ${day}`,
        duration: 2000,
      });
      return;
    }
    
    // Add to trip stops
    setTrip(prev => ({
      ...prev,
      stops: [...prev.stops.filter(stop => !(stop.placeId === placeId)), 
        { day, placeId, notes: '' }
      ]
    }));
    
    toast({
      title: "Schedule updated",
      description: `Added to Day ${day} of your trip`,
      duration: 2000,
    });
  };
  
  // Add notes to a stop
  const updateNotes = (placeId: string, day: number, notes: string) => {
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.map(stop => 
        stop.placeId === placeId && stop.day === day
          ? { ...stop, notes }
          : stop
      )
    }));
  };
  
  // Remove from day
  const removeFromDay = (placeId: string, day: number) => {
    setTrip(prev => ({
      ...prev,
      stops: prev.stops.filter(
        stop => !(stop.placeId === placeId && stop.day === day)
      )
    }));
  };
  
  // Save trip
  const saveTrip = () => {
    if (!trip.startDate || !trip.endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates for your trip",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (trip.stops.length === 0) {
      toast({
        title: "Empty trip",
        description: "Please add at least one stop to your trip",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // In a real app, this would save to a database
    toast({
      title: "Trip saved!",
      description: "Your trip has been saved successfully",
      duration: 3000,
    });
    
    navigate('/');
  };
  
  // Calculate trip duration in days (including start and end date)
  const getTripDuration = () => {
    if (!trip.startDate || !trip.endDate) return 0;
    
    const diffTime = Math.abs(trip.endDate.getTime() - trip.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  
  // Generate an array of day numbers for the trip
  const getDayNumbers = () => {
    const duration = getTripDuration();
    return Array.from({ length: duration }, (_, i) => i + 1);
  };
  
  // Get places scheduled for a specific day
  const getPlacesForDay = (day: number) => {
    const stopIds = trip.stops
      .filter(stop => stop.day === day)
      .map(stop => stop.placeId);
    
    return selectedPlaces.filter(place => stopIds.includes(place.id));
  };
  
  // Find a specific stop
  const findStop = (placeId: string, day: number) => {
    return trip.stops.find(
      stop => stop.placeId === placeId && stop.day === day
    );
  };
  
  return (
    <div className="container px-4 py-20 pt-20 pb-24 max-w-5xl">
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Trip Planner</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column: Search and selected places */}
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Places</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Search for places..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="mb-2"
                  />
                  
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="bg-card border rounded-md max-h-60 overflow-y-auto">
                      {searchResults.map(place => (
                        <div 
                          key={place.id}
                          className="p-2 border-b hover:bg-muted cursor-pointer flex items-center"
                          onClick={() => addPlaceToTrip(place)}
                        >
                          {place.type === 'hotel' ? 
                            <Hotel size={16} className="mr-2" /> : 
                            <Utensils size={16} className="mr-2" />
                          }
                          <div>
                            <div className="font-medium text-sm">{place.name}</div>
                            <div className="text-xs text-muted-foreground">{place.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Selected Places</h3>
                  {selectedPlaces.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No places selected. Search for places to add to your trip.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlaces.map(place => (
                        <div 
                          key={place.id}
                          className="bg-muted rounded-md p-2 flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center">
                            {place.type === 'hotel' ? 
                              <Hotel size={14} className="mr-2 text-muted-foreground" /> : 
                              <Utensils size={14} className="mr-2 text-muted-foreground" />
                            }
                            <span>{place.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removePlaceFromTrip(place.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Trip details and scheduling */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Trip Name</label>
                  <Input 
                    value={trip.name}
                    onChange={(e) => setTrip(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter trip name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !trip.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {trip.startDate ? (
                            format(trip.startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={trip.startDate}
                          onSelect={(date) => setTrip(prev => ({ ...prev, startDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !trip.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {trip.endDate ? (
                            format(trip.endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={trip.endDate}
                          onSelect={(date) => setTrip(prev => ({ ...prev, endDate: date }))}
                          initialFocus
                          disabled={(date) => 
                            (trip.startDate ? date < trip.startDate : false)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Trip itinerary */}
          {trip.startDate && trip.endDate && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Trip Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {getDayNumbers().length > 0 ? (
                  <div className="space-y-6">
                    {getDayNumbers().map(day => (
                      <div key={day} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2 flex items-center">
                          <span>Day {day}</span>
                          {trip.startDate && (
                            <span className="text-sm text-muted-foreground ml-2">
                              {format(
                                new Date(trip.startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000), 
                                "EEE, MMM d"
                              )}
                            </span>
                          )}
                        </h3>
                        
                        {/* Places assigned to this day */}
                        <div className="space-y-2 mb-3">
                          {getPlacesForDay(day).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No places scheduled for this day.</p>
                          ) : (
                            getPlacesForDay(day).map(place => {
                              const stop = findStop(place.id, day);
                              return (
                                <div key={place.id} className="bg-muted rounded-md p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-medium">{place.name}</h4>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <MapPin size={12} className="mr-1" />
                                        {place.location}
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-7 w-7 -mt-1 -mr-1"
                                      onClick={() => removeFromDay(place.id, day)}
                                    >
                                      <X size={14} />
                                    </Button>
                                  </div>
                                  
                                  {/* Notes */}
                                  <div className="mt-2">
                                    <Input 
                                      placeholder="Add notes (optional)"
                                      value={stop?.notes || ''}
                                      onChange={(e) => updateNotes(place.id, day, e.target.value)}
                                      className="text-sm h-8"
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                        
                        {/* Add place to this day */}
                        {selectedPlaces.length > 0 && (
                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                  + Add Place to Day {day}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0">
                                <div className="max-h-60 overflow-y-auto p-1">
                                  {selectedPlaces
                                    .filter(place => 
                                      !getPlacesForDay(day).map(p => p.id).includes(place.id)
                                    )
                                    .map(place => (
                                      <div 
                                        key={place.id}
                                        className="p-2 hover:bg-muted cursor-pointer rounded-md flex items-center"
                                        onClick={() => {
                                          addToDay(place.id, day);
                                        }}
                                      >
                                        {place.type === 'hotel' ? 
                                          <Hotel size={16} className="mr-2" /> : 
                                          <Utensils size={16} className="mr-2" />
                                        }
                                        <span>{place.name}</span>
                                      </div>
                                    ))
                                  }
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Select start and end dates to plan your itinerary.
                  </p>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button
                    className="bg-voyage-primary text-white hover:bg-voyage-secondary"
                    onClick={saveTrip}
                  >
                    Save Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
