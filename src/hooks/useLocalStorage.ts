
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Log activity
      const activity = {
        timestamp: new Date().toISOString(),
        action: `Updated ${key}`,
        data: valueToStore
      };
      logActivity(activity);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      toast.error(`Erreur lors de la sauvegarde: ${error}`);
    }
  };

  return [storedValue, setValue] as const;
};

const logActivity = (activity: any) => {
  try {
    const activities = JSON.parse(localStorage.getItem('site_activities') || '[]');
    activities.push(activity);
    
    // Garder seulement les 1000 dernières activités
    if (activities.length > 1000) {
      activities.splice(0, activities.length - 1000);
    }
    
    localStorage.setItem('site_activities', JSON.stringify(activities));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const exportActivities = () => {
  try {
    const activities = localStorage.getItem('site_activities') || '[]';
    const blob = new Blob([activities], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `activites-site-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Activités exportées avec succès!');
  } catch (error) {
    console.error('Error exporting activities:', error);
    toast.error('Erreur lors de l\'exportation des activités');
  }
};
