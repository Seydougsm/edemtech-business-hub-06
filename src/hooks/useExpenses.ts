
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'mobile';
  receipt_number?: string;
  notes?: string;
}

interface NewExpense {
  description: string;
  category: string;
  amount: number;
  payment_method: 'cash' | 'bank' | 'mobile';
  receipt_number?: string;
  notes?: string;
}

export const useExpenses = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['expenses', startDate, endDate],
    queryFn: async () => {
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
      
      if (error) throw error;
      return data as Expense[];
    }
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: NewExpense) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expense)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};
