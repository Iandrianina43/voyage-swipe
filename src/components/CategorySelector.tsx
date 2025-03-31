
import React from 'react';
import { Button } from '@/components/ui/button';
import { Hotel, Restaurant } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  activeCategory: 'hotel' | 'restaurant';
  onCategoryChange: (category: 'hotel' | 'restaurant') => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex justify-center space-x-2 my-4">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center space-x-2 rounded-full px-5 py-2 transition-all",
          activeCategory === 'hotel' ? 
            "bg-voyage-primary text-white" : 
            "text-muted-foreground hover:bg-muted"
        )}
        onClick={() => onCategoryChange('hotel')}
      >
        <Hotel size={20} />
        <span>Hotels</span>
      </Button>
      
      <Button
        variant="ghost"
        className={cn(
          "flex items-center space-x-2 rounded-full px-5 py-2 transition-all",
          activeCategory === 'restaurant' ? 
            "bg-voyage-accent text-white" : 
            "text-muted-foreground hover:bg-muted"
        )}
        onClick={() => onCategoryChange('restaurant')}
      >
        <Restaurant size={20} />
        <span>Restaurants</span>
      </Button>
    </div>
  );
};

export default CategorySelector;
