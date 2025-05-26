import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface StudentEnrollment {
  id: string;
  student_id: string;
  formation_id: string;
  total_amount: number;
  paid_amount: number;
  enrollment_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  // Relations
  student?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  formation?: {
    id: string;
    title: string;
    duration: string;
    price: number;
  };
}

interface NewStudentEnrollment {
  student_id: string;
  formation_id: string;
  total_amount: number;
  paid_amount?: number;
  enrollment_date?: string;
  status?: 'active' | 'completed' | 'cancelled';
}

export const useStudentEnrollments = () => {
  const [localEnrollments, setLocalEnrollments] = useLocalStorage<StudentEnrollment[]>('student_enrollments', []);

  return useQuery({
    queryKey: ['student_enrollments'],
    queryFn: async () => {
      console.log('Fetching student enrollments from Supabase...');
      try {
        const { data, error } = await supabase
          .from('student_enrollments')
          .select(`
            *,
            student:students(id, name, email, phone),
            formation:formations(id, title, duration, price)
          `)
          .order('enrollment_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching student enrollments, using local data:', error);
          toast.error('Erreur lors du chargement des inscriptions, utilisation des données locales');
          return localEnrollments;
        }
        
        console.log('Student enrollments fetched successfully:', data);
        // Transformer les données Supabase pour correspondre aux types attendus
        const transformedData = (data || []).map(enrollment => ({
          ...enrollment,
          status: enrollment.status as 'active' | 'completed' | 'cancelled'
        }));
        setLocalEnrollments(transformedData);
        return transformedData as StudentEnrollment[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.error('Erreur réseau, utilisation des données locales');
        return localEnrollments;
      }
    }
  });
};

export const useCreateStudentEnrollment = () => {
  const queryClient = useQueryClient();
  const [localEnrollments, setLocalEnrollments] = useLocalStorage<StudentEnrollment[]>('student_enrollments', []);
  
  return useMutation({
    mutationFn: async (enrollment: NewStudentEnrollment) => {
      console.log('Creating student enrollment:', enrollment);
      
      // Créer localement d'abord
      const newEnrollment: StudentEnrollment = {
        ...enrollment,
        id: `local_${Date.now()}`,
        paid_amount: enrollment.paid_amount || 0,
        enrollment_date: enrollment.enrollment_date || new Date().toISOString().split('T')[0],
        status: enrollment.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalEnrollments(prev => [...prev, newEnrollment]);
      
      try {
        const { data, error } = await supabase
          .from('student_enrollments')
          .insert({
            ...enrollment,
            enrollment_date: enrollment.enrollment_date || new Date().toISOString().split('T')[0]
          })
          .select(`
            *,
            student:students(id, name, email, phone),
            formation:formations(id, title, duration, price)
          `)
          .single();
        
        if (error) {
          console.error('Error creating student enrollment in database:', error);
          toast.error('Erreur lors de l\'inscription, sauvegarde locale seulement');
          return newEnrollment;
        }
        
        console.log('Student enrollment created successfully:', data);
        return {
          ...data,
          status: data.status as 'active' | 'completed' | 'cancelled'
        } as StudentEnrollment;
      } catch (error) {
        console.error('Network error, enrollment saved locally:', error);
        toast.error('Erreur réseau, sauvegarde locale seulement');
        return newEnrollment;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success(`Inscription créée avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateStudentEnrollment:', error);
      toast.error('Erreur lors de la création de l\'inscription');
    }
  });
};

export const useUpdateStudentEnrollment = () => {
  const queryClient = useQueryClient();
  const [localEnrollments, setLocalEnrollments] = useLocalStorage<StudentEnrollment[]>('student_enrollments', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StudentEnrollment> }) => {
      console.log('Updating student enrollment:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === id 
            ? { ...enrollment, ...updates, updated_at: new Date().toISOString() }
            : enrollment
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('student_enrollments')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            student:students(id, name, email, phone),
            formation:formations(id, title, duration, price)
          `)
          .single();
        
        if (error) {
          console.error('Error updating student enrollment in database:', error);
          toast.error('Erreur lors de la mise à jour, modification locale seulement');
          return { id, ...updates };
        }
        
        console.log('Student enrollment updated successfully:', data);
        return {
          ...data,
          status: data.status as 'active' | 'completed' | 'cancelled'
        } as StudentEnrollment;
      } catch (error) {
        console.error('Network error, enrollment updated locally:', error);
        toast.error('Erreur réseau, modification locale seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success(`Inscription mise à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateStudentEnrollment:', error);
      toast.error('Erreur lors de la mise à jour de l\'inscription');
    }
  });
};

export const useDeleteStudentEnrollment = () => {
  const queryClient = useQueryClient();
  const [localEnrollments, setLocalEnrollments] = useLocalStorage<StudentEnrollment[]>('student_enrollments', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting student enrollment:', id);
      
      // Supprimer localement d'abord
      setLocalEnrollments(prev => prev.filter(enrollment => enrollment.id !== id));
      
      try {
        const { error } = await supabase
          .from('student_enrollments')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting student enrollment from database:', error);
          toast.error('Erreur lors de la suppression, suppression locale seulement');
        } else {
          console.log('Student enrollment deleted successfully');
        }
      } catch (error) {
        console.error('Network error, enrollment deleted locally:', error);
        toast.error('Erreur réseau, suppression locale seulement');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success('Inscription supprimée avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteStudentEnrollment:', error);
      toast.error('Erreur lors de la suppression de l\'inscription');
    }
  });
};

export const useEnrollmentsByFormation = (formationId: string) => {
  return useQuery({
    queryKey: ['student_enrollments', 'by_formation', formationId],
    queryFn: async () => {
      console.log('Fetching enrollments for formation:', formationId);
      try {
        const { data, error } = await supabase
          .from('student_enrollments')
          .select(`
            *,
            student:students(id, name, email, phone)
          `)
          .eq('formation_id', formationId)
          .eq('status', 'active')
          .order('enrollment_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching enrollments by formation:', error);
          return [];
        }
        
        console.log('Enrollments by formation fetched successfully:', data);
        const transformedData = (data || []).map(enrollment => ({
          ...enrollment,
          status: enrollment.status as 'active' | 'completed' | 'cancelled'
        }));
        return transformedData;
      } catch (error) {
        console.error('Network error fetching enrollments by formation:', error);
        return [];
      }
    },
    enabled: !!formationId
  });
};
