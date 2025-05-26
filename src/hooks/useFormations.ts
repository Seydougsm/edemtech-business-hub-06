
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface Formation {
  id: string;
  title: string;
  description?: string;
  duration: string;
  price: number;
  max_participants: number;
  current_participants: number;
  start_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at?: string;
  updated_at?: string;
}

interface NewFormation {
  title: string;
  description?: string;
  duration: string;
  price: number;
  max_participants?: number;
  start_date: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export const useFormations = () => {
  const [localFormations, setLocalFormations] = useLocalStorage<Formation[]>('formations', []);

  return useQuery({
    queryKey: ['formations'],
    queryFn: async () => {
      console.log('Fetching formations from Supabase...');
      try {
        const { data, error } = await supabase
          .from('formations')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching formations, using local data:', error);
          toast.error('Erreur lors du chargement des formations, utilisation des données locales');
          return localFormations;
        }
        
        console.log('Formations fetched successfully:', data);
        setLocalFormations(data || []);
        return (data || []) as Formation[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.error('Erreur réseau, utilisation des données locales');
        return localFormations;
      }
    }
  });
};

export const useCreateFormation = () => {
  const queryClient = useQueryClient();
  const [localFormations, setLocalFormations] = useLocalStorage<Formation[]>('formations', []);
  
  return useMutation({
    mutationFn: async (formation: NewFormation) => {
      console.log('Creating formation:', formation);
      
      // Créer localement d'abord
      const newFormation: Formation = {
        ...formation,
        id: `local_${Date.now()}`,
        max_participants: formation.max_participants || 10,
        current_participants: 0,
        status: formation.status || 'upcoming',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalFormations(prev => [...prev, newFormation]);
      
      try {
        const { data, error } = await supabase
          .from('formations')
          .insert({
            ...formation,
            max_participants: formation.max_participants || 10
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating formation in database:', error);
          toast.error('Erreur lors de la création, sauvegarde locale seulement');
          return newFormation;
        }
        
        console.log('Formation created successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, formation saved locally:', error);
        toast.error('Erreur réseau, sauvegarde locale seulement');
        return newFormation;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success(`Formation "${data.title}" créée avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateFormation:', error);
      toast.error('Erreur lors de la création de la formation');
    }
  });
};

export const useUpdateFormation = () => {
  const queryClient = useQueryClient();
  const [localFormations, setLocalFormations] = useLocalStorage<Formation[]>('formations', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Formation> }) => {
      console.log('Updating formation:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalFormations(prev => 
        prev.map(formation => 
          formation.id === id 
            ? { ...formation, ...updates, updated_at: new Date().toISOString() }
            : formation
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('formations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating formation in database:', error);
          toast.error('Erreur lors de la mise à jour, modification locale seulement');
          return { id, ...updates };
        }
        
        console.log('Formation updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, formation updated locally:', error);
        toast.error('Erreur réseau, modification locale seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success(`Formation mise à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateFormation:', error);
      toast.error('Erreur lors de la mise à jour de la formation');
    }
  });
};

export const useDeleteFormation = () => {
  const queryClient = useQueryClient();
  const [localFormations, setLocalFormations] = useLocalStorage<Formation[]>('formations', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting formation:', id);
      
      // Supprimer localement d'abord
      setLocalFormations(prev => prev.filter(formation => formation.id !== id));
      
      try {
        const { error } = await supabase
          .from('formations')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting formation from database:', error);
          toast.error('Erreur lors de la suppression, suppression locale seulement');
        } else {
          console.log('Formation deleted successfully');
        }
      } catch (error) {
        console.error('Network error, formation deleted locally:', error);
        toast.error('Erreur réseau, suppression locale seulement');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      toast.success('Formation supprimée avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteFormation:', error);
      toast.error('Erreur lors de la suppression de la formation');
    }
  });
};
