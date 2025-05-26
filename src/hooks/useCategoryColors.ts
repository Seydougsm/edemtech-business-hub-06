
import { useLocalStorage } from './useLocalStorage';

interface CategoryColor {
  id: string;
  name: string;
  color: string;
}

const defaultCategories: CategoryColor[] = [
  { id: 'all', name: 'Tous', color: 'bg-gray-100' },
  { id: 'photocopie', name: 'Photocopie', color: 'bg-blue-100' },
  { id: 'impression', name: 'Impression', color: 'bg-green-100' },
  { id: 'saisie', name: 'Saisie', color: 'bg-purple-100' },
  { id: 'wifi', name: 'Wifi', color: 'bg-cyan-100' },
  { id: 'fourniture', name: 'Fournitures', color: 'bg-orange-100' },
  { id: 'consommables', name: 'Consommables', color: 'bg-pink-100' },
  { id: 'informatique', name: 'Informatique', color: 'bg-indigo-100' },
];

export const useCategoryColors = () => {
  const [categories, setCategories] = useLocalStorage<CategoryColor[]>('category_colors', defaultCategories);

  const updateCategoryColor = (categoryId: string, newColor: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, color: newColor }
          : cat
      )
    );
  };

  const resetToDefaults = () => {
    setCategories(defaultCategories);
  };

  return {
    categories,
    updateCategoryColor,
    resetToDefaults
  };
};
