
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon, MapPin, Plus, X, GripVertical, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { dummyPlaces, Place } from '@/data/places';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface TripStop {
  placeId: string;
  day: number;
  notes: string;
  order: number;
}

interface TripPath {
  name: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  stops: TripStop[];
}

const CreateTripPath = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tripPath, setTripPath] = useState<TripPath>({
    name: 'My Trip Path',
    description: '',
    startDate: undefined,
    endDate: undefined,
    stops: []
  });
  
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const results = dummyPlaces.filter(place => 
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.location.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  // Add place to selected places
  const addPlace = (place: Place) => {
    if (selectedPlaces.find(p => p.id === place.id)) {
      toast({
        title: "Already added",
        description: `${place.name} is already in your trip path`,
      });
      return;
    }
    
    setSelectedPlaces(prev => [...prev, place]);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Remove place from selected places
  const removePlace = (placeId: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId));
    setTripPath(prev => ({
      ...prev,
      stops: prev.stops.filter(s => s.placeId !== placeId)
    }));
  };
  
  // Add place to trip path
  const addToPath = (placeId: string) => {
    // Get the max order for the current stops
    const maxOrder = tripPath.stops.length > 0 
      ? Math.max(...tripPath.stops.map(s => s.order))
      : 0;
    
    setTripPath(prev => ({
      ...prev,
      stops: [...prev.stops, {
        placeId,
        day: 1, // Default to day 1
        notes: '',
        order: maxOrder + 1
      }]
    }));
    
    toast({
      title: "Added to path",
      description: "The place has been added to your trip path",
    });
  };
  
  // Remove place from trip path
  const removeFromPath = (placeId: string) => {
    setTripPath(prev => ({
      ...prev,
      stops: prev.stops.filter(s => s.placeId !== placeId)
    }));
  };
  
  // Move stop up or down in the path
  const moveStop = (placeId: string, direction: 'up' | 'down') => {
    const stops = [...tripPath.stops];
    const index = stops.findIndex(s => s.placeId === placeId);
    
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
      // Swap with the previous item
      const temp = stops[index];
      stops[index] = { ...stops[index - 1], order: temp.order };
      stops[index - 1] = { ...temp, order: stops[index].order };
    } else if (direction === 'down' && index < stops.length - 1) {
      // Swap with the next item
      const temp = stops[index];
      stops[index] = { ...stops[index + 1], order: temp.order };
      stops[index + 1] = { ...temp, order: stops[index].order };
    }
    
    setTripPath(prev => ({
      ...prev,
      stops: stops
    }));
  };
  
  // Update stop day
  const updateStopDay = (placeId: string, day: number) => {
    setTripPath(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.placeId === placeId ? { ...s, day } : s
      )
    }));
  };
  
  // Update stop notes
  const updateStopNotes = (placeId: string, notes: string) => {
    setTripPath(prev => ({
      ...prev,
      stops: prev.stops.map(s => 
        s.placeId === placeId ? { ...s, notes } : s
      )
    }));
  };
  
  // Save trip path
  const saveTripPath = () => {
    if (!tripPath.name.trim()) {
      toast({
        title: "Missing name",
        description: "Please provide a name for your trip path",
        variant: "destructive",
      });
      return;
    }
    
    if (!tripPath.startDate || !tripPath.endDate) {
      toast({
        title: "Missing dates",
        description: "Please select both start and end dates for your trip",
        variant: "destructive",
      });
      return;
    }
    
    if (tripPath.stops.length === 0) {
      toast({
        title: "Empty path",
        description: "Please add at least one place to your trip path",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would save to a database
    toast({
      title: "Trip path saved!",
      description: "Your trip path has been saved successfully",
    });
    
    navigate('/trip-planner');
  };
  
  // Get place by ID
  const getPlace = (placeId: string) => {
    return selectedPlaces.find(p => p.id === placeId) || 
           dummyPlaces.find(p => p.id === placeId);
  };
  
  // Order stops by their order property
  const orderedStops = [...tripPath.stops].sort((a, b) => a.order - b.order);
  
  // Calculate duration
  const getTripDuration = () => {
    if (!tripPath.startDate || !tripPath.endDate) return 0;
    
    const diffTime = Math.abs(tripPath.endDate.getTime() - tripPath.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
        <h1 className="text-2xl font-bold">Create Trip Path</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column: Path details and search */}
        <div className="md:col-span-1">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Trip Name</label>
                  <Input 
                    value={tripPath.name}
                    onChange={(e) => setTripPath(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter trip name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <Textarea 
                    value={tripPath.description}
                    onChange={(e) => setTripPath(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter trip description"
                    className="resize-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !tripPath.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripPath.startDate ? (
                          format(tripPath.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripPath.startDate}
                        onSelect={(date) => setTripPath(prev => ({ ...prev, startDate: date }))}
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
                          !tripPath.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tripPath.endDate ? (
                          format(tripPath.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripPath.endDate}
                        onSelect={(date) => setTripPath(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        disabled={(date) => 
                          (tripPath.startDate ? date < tripPath.startDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Places</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search for places..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="mb-2"
                />
                
                {searchResults.length > 0 && (
                  <div className="bg-card border rounded-md max-h-60 overflow-y-auto">
                    {searchResults.map(place => (
                      <div 
                        key={place.id}
                        className="p-2 border-b hover:bg-muted cursor-pointer flex items-center justify-between"
                        onClick={() => addPlace(place)}
                      >
                        <div className="flex items-center">
                          <span className="text-sm">{place.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {place.location}
                          </Badge>
                        </div>
                        <Plus size={16} />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Selected Places ({selectedPlaces.length})</h3>
                  {selectedPlaces.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No places selected. Search for places to add to your trip.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPlaces.map(place => {
                        const isInPath = tripPath.stops.some(s => s.placeId === place.id);
                        
                        return (
                          <div 
                            key={place.id}
                            className="bg-muted rounded-md p-2 flex items-center justify-between text-sm"
                          >
                            <div className="truncate mr-2">{place.name}</div>
                            <div className="flex items-center space-x-1">
                              {!isInPath && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => addToPath(place.id)}
                                >
                                  <Plus size={14} />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => removePlace(place.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Right column: Path builder */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Path Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              {tripPath.stops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">
                    Add places to create your trip path
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Select places from the left and add them to your path
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderedStops.map((stop, index) => {
                    const place = getPlace(stop.placeId);
                    if (!place) return null;
                    
                    return (
                      <div 
                        key={`${stop.placeId}-${index}`}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium">{place.name}</span>
                            <Badge variant="outline" className="ml-2">
                              Day {stop.day}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => moveStop(stop.placeId, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => moveStop(stop.placeId, 'down')}
                              disabled={index === orderedStops.length - 1}
                            >
                              <ArrowDown size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => removeFromPath(stop.placeId)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <MapPin size={12} className="mr-1" />
                          <span>{place.location}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <label className="text-xs font-medium block mb-1">Day</label>
                            <select 
                              className="w-full bg-background border rounded-md px-2 py-1 text-sm"
                              value={stop.day}
                              onChange={(e) => updateStopDay(stop.placeId, parseInt(e.target.value))}
                            >
                              {Array.from({length: getTripDuration() || 1}, (_, i) => i + 1).map(day => (
                                <option key={day} value={day}>
                                  Day {day}
                                  {tripPath.startDate && (
                                    ` - ${format(new Date(tripPath.startDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000), "MMM d")}`
                                  )}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium block mb-1">Notes</label>
                          <Textarea 
                            placeholder="Add notes (optional)"
                            value={stop.notes}
                            onChange={(e) => updateStopNotes(stop.placeId, e.target.value)}
                            className="resize-none text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-voyage-primary text-white hover:bg-voyage-secondary"
                  onClick={saveTripPath}
                >
                  Save Trip Path
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTripPath;
