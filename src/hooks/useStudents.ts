
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

interface NewStudent {
  name: string;
  email?: string;
  phone?: string;
  enrollment_date?: string;
  status?: 'active' | 'completed' | 'suspended';
}

export const useStudents = () => {
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>('students', []);

  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      console.log('Fetching students from Supabase...');
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching students, using local data:', error);
          toast.error('Erreur lors du chargement des étudiants, utilisation des données locales');
          return localStudents;
        }
        
        console.log('Students fetched successfully:', data);
        setLocalStudents(data || []);
        return (data || []) as Student[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.error('Erreur réseau, utilisation des données locales');
        return localStudents;
      }
    }
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>('students', []);
  
  return useMutation({
    mutationFn: async (student: NewStudent) => {
      console.log('Creating student:', student);
      
      // Créer localement d'abord
      const newStudent: Student = {
        ...student,
        id: `local_${Date.now()}`,
        enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0],
        status: student.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalStudents(prev => [...prev, newStudent]);
      
      try {
        const { data, error } = await supabase
          .from('students')
          .insert({
            ...student,
            enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0]
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating student in database:', error);
          toast.error('Erreur lors de la création, sauvegarde locale seulement');
          return newStudent;
        }
        
        console.log('Student created successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, student saved locally:', error);
        toast.error('Erreur réseau, sauvegarde locale seulement');
        return newStudent;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(`Étudiant "${data.name}" créé avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateStudent:', error);
      toast.error('Erreur lors de la création de l\'étudiant');
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>('students', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Student> }) => {
      console.log('Updating student:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalStudents(prev => 
        prev.map(student => 
          student.id === id 
            ? { ...student, ...updates, updated_at: new Date().toISOString() }
            : student
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('students')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating student in database:', error);
          toast.error('Erreur lors de la mise à jour, modification locale seulement');
          return { id, ...updates };
        }
        
        console.log('Student updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, student updated locally:', error);
        toast.error('Erreur réseau, modification locale seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success(`Étudiant mis à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateStudent:', error);
      toast.error('Erreur lors de la mise à jour de l\'étudiant');
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const [localStudents, setLocalStudents] = useLocalStorage<Student[]>('students', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting student:', id);
      
      // Supprimer localement d'abord
      setLocalStudents(prev => prev.filter(student => student.id !== id));
      
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting student from database:', error);
          toast.error('Erreur lors de la suppression, suppression locale seulement');
        } else {
          console.log('Student deleted successfully');
        }
      } catch (error) {
        console.error('Network error, student deleted locally:', error);
        toast.error('Erreur réseau, suppression locale seulement');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      toast.success('Étudiant supprimé avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteStudent:', error);
      toast.error('Erreur lors de la suppression de l\'étudiant');
    }
  });
};
