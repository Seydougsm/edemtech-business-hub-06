
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      console.log('Fetching services from local storage...');
      // Puisque la table 'services' n'existe pas dans Supabase, on utilise uniquement le stockage local
      console.log('Services fetched successfully from local storage:', localServices);
      return localServices;
    }
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const [localServices, setLocalServices] = useLocalStorage<Service[]>('services', []);
  
  return useMutation({
    mutationFn: async (service: NewService) => {
      console.log('Creating service:', service);
      
      const newService: Service = {
        ...service,
        id: `service_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalServices(prev => [...prev, newService]);
      console.log('Service created successfully:', newService);
      return newService;
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
      
      setLocalServices(prev => 
        prev.map(service => 
          service.id === id 
            ? { ...service, ...updates, updated_at: new Date().toISOString() }
            : service
        )
      );
      
      console.log('Service updated successfully');
      return { id, ...updates };
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
      
      setLocalServices(prev => prev.filter(service => service.id !== id));
      console.log('Service deleted successfully');
      
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
