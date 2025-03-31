
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dummyPlaces } from '@/data/places';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Heart, MapPin, Hotel, Utensils, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  guests: z.string().min(1, { message: "Please enter the number of guests" }),
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
});

const PlaceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: "1",
      name: "",
      email: "",
    },
  });
  
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

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    console.log("Booking data:", data);
    toast({
      title: "Booking successful!",
      description: `Your booking at ${place.name} on ${format(data.date, "PPP")} has been confirmed.`,
      duration: 3000,
    });
    setShowBookingDialog(false);
    form.reset();
  };
  
  const renderPriceLevel = (price: number) => {
    return Array(4).fill(0).map((_, index) => (
      <span key={index} className={index < price ? "text-foreground" : "text-muted-foreground opacity-40"}>
        $
      </span>
    ));
  };
  
  const TypeIcon = place.type === 'hotel' ? Hotel : Utensils;
  
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
          
          <div className="mt-8 space-y-3">
            <Button 
              className="w-full bg-voyage-primary hover:bg-voyage-secondary"
              onClick={() => setShowBookingDialog(true)}
            >
              {place.type === 'hotel' ? 'Book a Room' : 'Make a Reservation'}
            </Button>
            
            <Link to="/trip-planner">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <CalendarDays className="mr-2" size={16} />
                Add to Trip Planner
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{place.type === 'hotel' ? 'Book a Room' : 'Make a Reservation'}</DialogTitle>
            <DialogDescription>
              Fill out the form below to complete your {place.type === 'hotel' ? 'booking' : 'reservation'} at {place.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-voyage-primary hover:bg-voyage-secondary"
                >
                  Confirm {place.type === 'hotel' ? 'Booking' : 'Reservation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaceDetails;
