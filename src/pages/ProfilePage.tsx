
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  username: string;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setProfile(data as Profile);
          }
        });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLanguageChange = async (value: 'en' | 'fr' | 'mg') => {
    await setLanguage(value);
    toast({
      title: t('language'),
      description: t(value === 'en' ? 'english' : value === 'fr' ? 'french' : 'malagasy'),
    });
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <Link to="/" className="mr-2">
          <ArrowLeft size={20} className="text-tripadvisor-primary" />
        </Link>
        <h1 className="text-lg font-semibold">{t('profile')}</h1>
      </div>
      
      <div className="px-4 py-6">
        {user ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                <AvatarFallback className="bg-tripadvisor-light text-tripadvisor-primary text-xl">
                  {(profile?.username?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile?.username || user.email}</h2>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <div className="flex items-center mb-4">
                <Globe className="mr-2 text-tripadvisor-primary" />
                <h3 className="text-lg font-medium">{t('language')}</h3>
              </div>
              
              <RadioGroup value={language} onValueChange={(v) => handleLanguageChange(v as 'en' | 'fr' | 'mg')} className="mt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en">{t('english')}</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="fr" id="fr" />
                  <Label htmlFor="fr">{t('french')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mg" id="mg" />
                  <Label htmlFor="mg">{t('malagasy')}</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t('logout')}
            </Button>
          </>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-lg font-medium mb-4">{t('login')}</h2>
            <Button asChild className="mx-auto">
              <Link to="/auth">{t('login')}</Link>
            </Button>
          </div>
        )}
      </div>
      
      <NavBar />
    </div>
  );
};

export default ProfilePage;
