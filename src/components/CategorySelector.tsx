
import React from 'react';
import { Button } from '@/components/ui/button';
import { Hotel, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategorySelectorProps {
  activeCategory: 'hotel' | 'restaurant';
  onCategoryChange: (category: 'hotel' | 'restaurant') => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center space-x-2 my-4">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center space-x-2 rounded-full px-5 py-2 transition-all",
          activeCategory === 'hotel' ? 
            "bg-tripadvisor-primary text-white" : 
            "text-muted-foreground hover:bg-muted"
        )}
        onClick={() => onCategoryChange('hotel')}
      >
        <Hotel size={20} />
        <span>{t('hotels')}</span>
      </Button>
      
      <Button
        variant="ghost"
        className={cn(
          "flex items-center space-x-2 rounded-full px-5 py-2 transition-all",
          activeCategory === 'restaurant' ? 
            "bg-tripadvisor-accent text-white" : 
            "text-muted-foreground hover:bg-muted"
        )}
        onClick={() => onCategoryChange('restaurant')}
      >
        <Utensils size={20} />
        <span>{t('restaurants')}</span>
      </Button>
    </div>
  );
};

export default CategorySelector;
