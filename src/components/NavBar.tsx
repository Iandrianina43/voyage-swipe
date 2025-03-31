
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-voyage-primary to-voyage-accent bg-clip-text text-transparent">
            Mi Voyage
          </h1>
        </Link>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/search">
              <Search size={20} />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/explore">
              <MapPin size={20} />
              <span className="sr-only">Map</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/saved">
              <Heart size={20} />
              <span className="sr-only">Saved</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
