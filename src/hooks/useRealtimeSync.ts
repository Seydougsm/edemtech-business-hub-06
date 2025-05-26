
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up realtime subscriptions...');

    // Subscription pour les produits
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
      )
      .subscribe();

    // Subscription pour les services
    const servicesChannel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        (payload) => {
          console.log('Services table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['services'] });
        }
      )
      .subscribe();

    // Subscription pour les ventes
    const salesChannel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        (payload) => {
          console.log('Sales table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['sales'] });
        }
      )
      .subscribe();

    // Subscription pour les dépenses
    const expensesChannel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log('Expenses table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
      )
      .subscribe();

    // Subscription pour les mouvements d'inventaire
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_movements'
        },
        (payload) => {
          console.log('Inventory movements changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['inventory_movements'] });
        }
      )
      .subscribe();

    // Subscription pour les étudiants
    const studentsChannel = supabase
      .channel('students-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Students table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['students'] });
        }
      )
      .subscribe();

    // Subscription pour les formations
    const formationsChannel = supabase
      .channel('formations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'formations'
        },
        (payload) => {
          console.log('Formations table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['formations'] });
        }
      )
      .subscribe();

    // Subscription pour les inscriptions d'étudiants
    const enrollmentsChannel = supabase
      .channel('enrollments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_enrollments'
        },
        (payload) => {
          console.log('Student enrollments changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
          queryClient.invalidateQueries({ queryKey: ['formations'] });
        }
      )
      .subscribe();

    // Subscription pour les paiements de formation
    const paymentsChannel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'formation_payments'
        },
        (payload) => {
          console.log('Formation payments changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['formation_payments'] });
          queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
        }
      )
      .subscribe();

    // Subscription pour les devis
    const quotesChannel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quotes'
        },
        (payload) => {
          console.log('Quotes table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['quotes'] });
        }
      )
      .subscribe();

    // Subscription pour les éléments de devis
    const quoteItemsChannel = supabase
      .channel('quote-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_items'
        },
        (payload) => {
          console.log('Quote items table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['quotes'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(salesChannel);
      supabase.removeChannel(expensesChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(formationsChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(quoteItemsChannel);
    };
  }, [queryClient]);
};
