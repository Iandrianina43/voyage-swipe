
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type Language = 'en' | 'fr' | 'mg';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
};

// Simple translations for core functionality
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'Mi Voyage',
    'hotels': 'Hotels',
    'restaurants': 'Restaurants',
    'discover': 'Discover & Explore',
    'discover.subtitle': 'Find amazing places with a swipe',
    'saved.places': 'Your Saved Places',
    'search': 'Search',
    'explore': 'Explore',
    'trips': 'Trips',
    'home': 'Home',
    'login': 'Login',
    'logout': 'Logout',
    'profile': 'Profile',
    'no.saved.places': 'No saved places yet',
    'swipe.right.save': 'Swipe right on places you love to save them here.',
    'discover.places': 'Discover Places',
    'search.placeholder': 'Search for hotels, restaurants, locations...',
    'recent.searches': 'Recent Searches',
    'popular.categories': 'Popular Categories',
    'language': 'Language',
    'english': 'English',
    'french': 'French',
    'malagasy': 'Malagasy',
  },
  fr: {
    'app.name': 'Mi Voyage',
    'hotels': 'Hôtels',
    'restaurants': 'Restaurants',
    'discover': 'Découvrir & Explorer',
    'discover.subtitle': 'Trouvez des endroits incroyables en un glissement',
    'saved.places': 'Vos Lieux Enregistrés',
    'search': 'Rechercher',
    'explore': 'Explorer',
    'trips': 'Voyages',
    'home': 'Accueil',
    'login': 'Connexion',
    'logout': 'Déconnexion',
    'profile': 'Profil',
    'no.saved.places': 'Pas encore de lieux enregistrés',
    'swipe.right.save': 'Glissez à droite sur les lieux que vous aimez pour les enregistrer ici.',
    'discover.places': 'Découvrir des Lieux',
    'search.placeholder': 'Rechercher des hôtels, restaurants, lieux...',
    'recent.searches': 'Recherches Récentes',
    'popular.categories': 'Catégories Populaires',
    'language': 'Langue',
    'english': 'Anglais',
    'french': 'Français',
    'malagasy': 'Malgache',
  },
  mg: {
    'app.name': 'Mi Voyage',
    'hotels': 'Hotely',
    'restaurants': 'Trano Fisakafoana',
    'discover': 'Hikaroka & Hitety',
    'discover.subtitle': 'Mahita toerana mahafinaritra amin\'ny fikisakisahana',
    'saved.places': 'Ny Toerana Voatahirinao',
    'search': 'Hikaroka',
    'explore': 'Hitety',
    'trips': 'Dia',
    'home': 'Fandraisana',
    'login': 'Hiditra',
    'logout': 'Hiala',
    'profile': 'Mombamomba Anao',
    'no.saved.places': 'Tsy misy toerana voatahiry',
    'swipe.right.save': 'Mikisakisaha ho ankavanana amin\'ny toerana tianao mba hitahiry azy eto.',
    'discover.places': 'Hikaroka Toerana',
    'search.placeholder': 'Hikaroka hotely, trano fisakafoana, toerana...',
    'recent.searches': 'Fikarohana Vao Haingana',
    'popular.categories': 'Sokajy Malaza',
    'language': 'Fiteny',
    'english': 'Anglisy',
    'french': 'Frantsay',
    'malagasy': 'Malagasy',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Get user's language preference from local storage first
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'fr', 'mg'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
    }

    // If user is logged in, get their language preference from the database
    if (user) {
      supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.language) {
            const userLanguage = data.language as Language;
            setLanguageState(userLanguage);
            localStorage.setItem('language', userLanguage);
          }
        });
    }
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // If user is logged in, update their language preference in the database
    if (user) {
      await supabase
        .from('profiles')
        .update({ language: lang })
        .eq('id', user.id);
    }
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
