
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'mobile';
  receipt_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface NewExpense {
  description: string;
  category: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'mobile';
  receipt_number?: string;
  notes?: string;
  date?: string;
}

export const useExpenses = (startDate?: string, endDate?: string) => {
  const [localExpenses, setLocalExpenses] = useLocalStorage<Expense[]>('expenses', []);

  return useQuery({
    queryKey: ['expenses', startDate, endDate],
    queryFn: async () => {
      console.log('Fetching expenses from Supabase...');
      try {
        let query = supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });
        
        if (startDate) {
          query = query.gte('date', startDate);
        }
        if (endDate) {
          query = query.lte('date', endDate);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching expenses, using local data:', error);
          toast.error('Erreur lors du chargement, utilisation des données locales');
          return localExpenses.filter(expense => {
            if (startDate && expense.date < startDate) return false;
            if (endDate && expense.date > endDate) return false;
            return true;
          });
        }
        
        console.log('Expenses fetched successfully:', data);
        // Convertir les données Supabase en format local
        const formattedData = (data || []).map(item => ({
          ...item,
          payment_method: (item.payment_method || 'cash') as 'cash' | 'bank' | 'mobile'
        }));
        setLocalExpenses(formattedData);
        return formattedData as Expense[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.error('Erreur réseau, utilisation des données locales');
        return localExpenses;
      }
    }
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const [localExpenses, setLocalExpenses] = useLocalStorage<Expense[]>('expenses', []);
  
  return useMutation({
    mutationFn: async (expense: NewExpense) => {
      console.log('Creating expense:', expense);
      
      // Créer localement d'abord
      const newExpense: Expense = {
        ...expense,
        id: `local_${Date.now()}`,
        date: expense.date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalExpenses(prev => [newExpense, ...prev]);
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            ...expense,
            date: expense.date || new Date().toISOString().split('T')[0]
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating expense in database:', error);
          toast.error('Erreur lors de la création, sauvegarde locale seulement');
          return newExpense;
        }
        
        console.log('Expense created successfully:', data);
        const formattedData = {
          ...data,
          payment_method: (data.payment_method || 'cash') as 'cash' | 'bank' | 'mobile'
        };
        return formattedData;
      } catch (error) {
        console.error('Network error, expense saved locally:', error);
        toast.error('Erreur réseau, sauvegarde locale seulement');
        return newExpense;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(`Dépense "${data.description}" enregistrée avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateExpense:', error);
      toast.error('Erreur lors de l\'enregistrement de la dépense');
    }
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  const [localExpenses, setLocalExpenses] = useLocalStorage<Expense[]>('expenses', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
      console.log('Updating expense:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalExpenses(prev => 
        prev.map(expense => 
          expense.id === id 
            ? { ...expense, ...updates, updated_at: new Date().toISOString() }
            : expense
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating expense in database:', error);
          toast.error('Erreur lors de la mise à jour, modification locale seulement');
          return { id, ...updates };
        }
        
        console.log('Expense updated successfully:', data);
        const formattedData = {
          ...data,
          payment_method: (data.payment_method || 'cash') as 'cash' | 'bank' | 'mobile'
        };
        return formattedData;
      } catch (error) {
        console.error('Network error, expense updated locally:', error);
        toast.error('Erreur réseau, modification locale seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(`Dépense mise à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateExpense:', error);
      toast.error('Erreur lors de la mise à jour de la dépense');
    }
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  const [localExpenses, setLocalExpenses] = useLocalStorage<Expense[]>('expenses', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting expense:', id);
      
      // Supprimer localement d'abord
      setLocalExpenses(prev => prev.filter(expense => expense.id !== id));
      
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting expense from database:', error);
          toast.error('Erreur lors de la suppression, suppression locale seulement');
        } else {
          console.log('Expense deleted successfully');
        }
      } catch (error) {
        console.error('Network error, expense deleted locally:', error);
        toast.error('Erreur réseau, suppression locale seulement');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Dépense supprimée avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteExpense:', error);
      toast.error('Erreur lors de la suppression de la dépense');
    }
  });
};
