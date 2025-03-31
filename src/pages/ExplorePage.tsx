
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ExplorePage = () => {
  return (
    <div className="container px-4 py-20 pt-24">
      <h1 className="text-2xl font-bold mb-6">Explore Destinations</h1>
      
      <div className="grid gap-4">
        <Card className="relative h-40 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1518548235008-15c2e3a4fdd3?q=80&w=1740&auto=format&fit=crop" 
            alt="New York" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <div className="flex items-center mb-1">
                <MapPin size={16} className="mr-1" />
                <h3 className="font-bold text-lg">New York</h3>
              </div>
              <p className="text-sm opacity-90">237 hotels, 425 restaurants</p>
            </div>
          </div>
        </Card>
        
        <Card className="relative h-40 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542704792-e30dac463c90?q=80&w=1740&auto=format&fit=crop" 
            alt="Paris" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <div className="flex items-center mb-1">
                <MapPin size={16} className="mr-1" />
                <h3 className="font-bold text-lg">Paris</h3>
              </div>
              <p className="text-sm opacity-90">189 hotels, 380 restaurants</p>
            </div>
          </div>
        </Card>
        
        <Card className="relative h-40 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1562191326-0b2300ce9fb2?q=80&w=1740&auto=format&fit=crop" 
            alt="Tokyo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <div className="flex items-center mb-1">
                <MapPin size={16} className="mr-1" />
                <h3 className="font-bold text-lg">Tokyo</h3>
              </div>
              <p className="text-sm opacity-90">312 hotels, 782 restaurants</p>
            </div>
          </div>
        </Card>
        
        <Card className="relative h-40 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1740&auto=format&fit=crop" 
            alt="San Francisco" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <div className="flex items-center mb-1">
                <MapPin size={16} className="mr-1" />
                <h3 className="font-bold text-lg">San Francisco</h3>
              </div>
              <p className="text-sm opacity-90">156 hotels, 324 restaurants</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Detailed map view coming soon!
        </p>
      </div>
    </div>
  );
};

export default ExplorePage;
