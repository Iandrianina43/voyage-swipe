
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart, Home, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="container max-w-md mx-auto flex items-center justify-center h-14 px-4 relative">
          <Link to="/" className="absolute left-4">
            <h1 className="text-xl font-bold text-tripadvisor-primary">
              Mi Voyage
            </h1>
          </Link>
        </div>
      </header>
      
      {/* Bottom navigation */}
      <nav className="mobile-nav max-w-md mx-auto">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/search" className={`nav-item ${isActive('/search') ? 'active' : ''}`}>
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        <Link to="/explore" className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
          <MapPin size={20} />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        
        <Link to="/saved" className={`nav-item ${isActive('/saved') ? 'active' : ''}`}>
          <Heart size={20} />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        
        <Link to="/trip-planner" className={`nav-item ${isActive('/trip-planner') ? 'active' : ''}`}>
          <Calendar size={20} />
          <span className="text-xs mt-1">Trips</span>
        </Link>
      </nav>
    </>
  );
};

export default NavBar;
