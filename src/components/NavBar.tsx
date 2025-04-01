
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart, Home, Calendar, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Desktop sidebar navigation
  const DesktopNav = () => (
    <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-border p-6">
      <Link to="/" className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-tripadvisor-primary">
          Mi Voyage
        </h1>
      </Link>
      
      <nav className="space-y-2">
        <NavLink path="/" icon={<Home size={20} />} label={t('home')} />
        <NavLink path="/search" icon={<Search size={20} />} label={t('search')} />
        <NavLink path="/explore" icon={<MapPin size={20} />} label={t('explore')} />
        <NavLink path="/saved" icon={<Heart size={20} />} label={t('saved.places')} />
        <NavLink path="/trip-planner" icon={<Calendar size={20} />} label={t('trips')} />
        <NavLink path="/profile" icon={<User size={20} />} label={t('profile')} />
      </nav>
    </div>
  );

  // Mobile bottom navigation
  const MobileNav = () => (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="container max-w-md mx-auto flex items-center justify-center h-14 px-4 relative">
          <Link to="/" className="absolute left-4">
            <h1 className="text-xl font-bold text-tripadvisor-primary">
              {t('app.name')}
            </h1>
          </Link>
          <Link to="/profile" className="absolute right-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Bottom navigation */}
      <nav className="mobile-nav max-w-md mx-auto">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <Home size={20} />
          <span className="text-xs mt-1">{t('home')}</span>
        </Link>
        
        <Link to="/search" className={`nav-item ${isActive('/search') ? 'active' : ''}`}>
          <Search size={20} />
          <span className="text-xs mt-1">{t('search')}</span>
        </Link>
        
        <Link to="/explore" className={`nav-item ${isActive('/explore') ? 'active' : ''}`}>
          <MapPin size={20} />
          <span className="text-xs mt-1">{t('explore')}</span>
        </Link>
        
        <Link to="/saved" className={`nav-item ${isActive('/saved') ? 'active' : ''}`}>
          <Heart size={20} />
          <span className="text-xs mt-1">{t('saved.places')}</span>
        </Link>
        
        <Link to="/trip-planner" className={`nav-item ${isActive('/trip-planner') ? 'active' : ''}`}>
          <Calendar size={20} />
          <span className="text-xs mt-1">{t('trips')}</span>
        </Link>
      </nav>
    </>
  );

  // Reusable NavLink component for desktop sidebar
  const NavLink = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <Link 
      to={path} 
      className={`flex items-center p-3 rounded-lg transition-colors ${
        isActive(path) 
          ? 'bg-tripadvisor-light text-tripadvisor-primary font-medium' 
          : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );

  return isMobile ? <MobileNav /> : <DesktopNav />;
};

export default NavBar;
