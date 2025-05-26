
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface Service {
  id: string;
  name: string;
  category: 'photocopie' | 'saisie' | 'impression' | 'wifi' | 'autre';
  price: number;
  unit: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface NewService {
  name: string;
  category: 'photocopie' | 'saisie' | 'impression' | 'wifi' | 'autre';
  price: number;
  unit: string;
  description?: string;
}

export const useServices = () => {
  const [localServices, setLocalServices] = useLocalStorage<Service[]>('services', []);
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      console.log('Fetching services from Supabase...');
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching services, using local data:', error);
          toast.warn('Utilisation des données locales pour les services');
          return localServices;
        }
        
        console.log('Services fetched successfully:', data);
        setLocalServices(data || []);
        return data as Service[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.warn('Erreur réseau, utilisation des données locales');
        return localServices;
      }
    }
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const [localServices, setLocalServices] = useLocalStorage<Service[]>('services', []);
  
  return useMutation({
    mutationFn: async (service: NewService) => {
      console.log('Creating service:', service);
      
      // Créer localement d'abord
      const newService = {
        ...service,
        id: `local_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalServices(prev => [...prev, newService]);
      
      try {
        const { data, error } = await supabase
          .from('services')
          .insert(service)
          .select()
          .single();
        
        if (error) {
          console.error('Error creating service in database:', error);
          toast.warn('Service sauvegardé localement seulement');
          return newService;
        }
        
        console.log('Service created successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, service saved locally:', error);
        toast.warn('Service sauvegardé localement seulement');
        return newService;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(`Service "${data.name}" créé avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateService:', error);
      toast.error('Erreur lors de la création du service');
    }
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const [localServices, setLocalServices] = useLocalStorage<Service[]>('services', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Service> }) => {
      console.log('Updating service:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalServices(prev => 
        prev.map(service => 
          service.id === id 
            ? { ...service, ...updates, updated_at: new Date().toISOString() }
            : service
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('services')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating service in database:', error);
          toast.warn('Service mis à jour localement seulement');
          return { id, ...updates };
        }
        
        console.log('Service updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, service updated locally:', error);
        toast.warn('Service mis à jour localement seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(`Service mis à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateService:', error);
      toast.error('Erreur lors de la mise à jour du service');
    }
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const [localServices, setLocalServices] = useLocalStorage<Service[]>('services', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting service:', id);
      
      // Supprimer localement d'abord
      setLocalServices(prev => prev.filter(service => service.id !== id));
      
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting service from database:', error);
          toast.warn('Service supprimé localement seulement');
        } else {
          console.log('Service deleted successfully');
        }
      } catch (error) {
        console.error('Network error, service deleted locally:', error);
        toast.warn('Service supprimé localement seulement');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service supprimé avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteService:', error);
      toast.error('Erreur lors de la suppression du service');
    }
  });
};
