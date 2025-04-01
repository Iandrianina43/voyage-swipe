
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MapPin, Heart, Home, Calendar, User, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const { t, language, setLanguage } = useLanguage();
  const isMobile = useIsMobile();

  // Desktop sidebar navigation
  const DesktopNav = () => (
    <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-border p-6">
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
      
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <LanguageSelector />
      </div>
    </div>
  );

  // Mobile bottom navigation
  const MobileNav = () => (
    <>
      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
        <div className="container max-w-md mx-auto flex items-center justify-center h-14 px-4 relative">
          <Link to="/" className="absolute left-4">
            <h1 className="text-xl font-bold text-tripadvisor-primary">
              {t('app.name')}
            </h1>
          </Link>
          <LanguageSelector className="absolute right-12" />
          <Link to="/profile" className="absolute right-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around p-2 max-w-md mx-auto">
        <NavItem to="/" icon={<Home size={20} />} label={t('home')} isActive={isActive('/')} />
        <NavItem to="/search" icon={<Search size={20} />} label={t('search')} isActive={isActive('/search')} />
        <NavItem to="/explore" icon={<MapPin size={20} />} label={t('explore')} isActive={isActive('/explore')} />
        <NavItem to="/saved" icon={<Heart size={20} />} label={t('saved.places')} isActive={isActive('/saved')} />
        <NavItem to="/trip-planner" icon={<Calendar size={20} />} label={t('trips')} isActive={isActive('/trip-planner')} />
      </nav>
    </>
  );

  // Language selector component
  const LanguageSelector = ({ className = "" }: { className?: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full ${className}`}>
          <Globe size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-lg border rounded-lg">
        <DropdownMenuItem onClick={() => setLanguage('fr')} className={language === 'fr' ? 'bg-tripadvisor-light font-medium' : 'hover:bg-gray-100'}>
          {t('french')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-tripadvisor-light font-medium' : 'hover:bg-gray-100'}>
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('mg')} className={language === 'mg' ? 'bg-tripadvisor-light font-medium' : 'hover:bg-gray-100'}>
          {t('malagasy')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  
  // Mobile navigation item
  const NavItem = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
    <Link to={to} className="flex flex-col items-center justify-center w-1/5 py-1">
      <div className={`p-1.5 rounded-full ${isActive ? 'bg-tripadvisor-light text-tripadvisor-primary' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-tripadvisor-primary font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );

  return isMobile ? <MobileNav /> : <DesktopNav />;
};

export default NavBar;
