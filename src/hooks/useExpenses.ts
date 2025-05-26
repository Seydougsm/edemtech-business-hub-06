
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  return useQuery({
    queryKey: ['expenses', startDate, endDate],
    queryFn: async () => {
      console.log('Fetching expenses from Supabase...');
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
        console.error('Error fetching expenses:', error);
        throw error;
      }
      console.log('Expenses fetched successfully:', data);
      return data as Expense[];
    }
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: NewExpense) => {
      console.log('Creating expense:', expense);
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expense,
          date: expense.date || new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating expense:', error);
        throw error;
      }
      console.log('Expense created successfully:', data);
      return data;
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
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
      console.log('Updating expense:', id, updates);
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }
      console.log('Expense updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(`Dépense "${data.description}" mise à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateExpense:', error);
      toast.error('Erreur lors de la mise à jour de la dépense');
    }
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting expense:', id);
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }
      console.log('Expense deleted successfully');
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
