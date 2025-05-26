
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface QuoteItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  type: 'service' | 'product';
}

interface Quote {
  id: string;
  quote_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  valid_until: string;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

interface NewQuote {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  valid_until: string;
}

export const useQuotes = () => {
  const [localQuotes, setLocalQuotes] = useLocalStorage<Quote[]>('quotes', []);

  return useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      console.log('Fetching quotes from Supabase...');
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select(`
            *,
            quote_items (
              id,
              product_name,
              quantity,
              unit_price,
              total
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching quotes, using local data:', error);
          toast.error('Erreur lors du chargement des devis, utilisation des données locales');
          return localQuotes;
        }
        
        console.log('Quotes fetched successfully:', data);
        const transformedData = (data || []).map(quote => ({
          ...quote,
          status: quote.status as 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired',
          items: quote.quote_items?.map((item: any) => ({
            id: item.id,
            name: item.product_name,
            price: item.unit_price,
            quantity: item.quantity,
            category: 'general',
            type: 'product' as const
          })) || []
        }));
        setLocalQuotes(transformedData);
        return transformedData as Quote[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.error('Erreur réseau, utilisation des données locales');
        return localQuotes;
      }
    }
  });
};

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  const [localQuotes, setLocalQuotes] = useLocalStorage<Quote[]>('quotes', []);
  
  return useMutation({
    mutationFn: async (quoteData: NewQuote) => {
      console.log('Creating quote:', quoteData);
      
      const quoteNumber = `DEV-${Date.now()}`;
      
      // Créer localement d'abord
      const newQuote: Quote = {
        id: `local_${Date.now()}`,
        quote_number: quoteNumber,
        customer_name: quoteData.customer_name || undefined,
        customer_phone: quoteData.customer_phone || undefined,
        customer_email: quoteData.customer_email || undefined,
        subtotal: quoteData.subtotal,
        discount: quoteData.discount,
        total: quoteData.total,
        status: 'draft',
        valid_until: quoteData.valid_until,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: quoteData.items
      };
      
      setLocalQuotes(prev => [newQuote, ...prev]);
      
      try {
        const { data: quote, error: quoteError } = await supabase
          .from('quotes')
          .insert({
            quote_number: quoteNumber,
            customer_name: quoteData.customer_name || null,
            customer_phone: quoteData.customer_phone || null,
            customer_email: quoteData.customer_email || null,
            subtotal: quoteData.subtotal,
            discount: quoteData.discount,
            total: quoteData.total,
            valid_until: quoteData.valid_until
          })
          .select()
          .single();
        
        if (quoteError) {
          console.error('Error creating quote in database:', quoteError);
          toast.error('Erreur lors de la création, sauvegarde locale seulement');
          return newQuote;
        }
        
        // Créer les articles du devis
        for (const item of quoteData.items) {
          const { error: itemError } = await supabase
            .from('quote_items')
            .insert({
              quote_id: quote.id,
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              unit_price: item.price,
              total: item.price * item.quantity
            });
          
          if (itemError) {
            console.error('Error creating quote item:', itemError);
          }
        }
        
        console.log('Quote created successfully:', quote);
        return { ...quote, items: quoteData.items } as Quote;
      } catch (error) {
        console.error('Network error, quote saved locally:', error);
        toast.error('Erreur réseau, sauvegarde locale seulement');
        return newQuote;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success(`Devis ${data.quote_number} créé avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateQuote:', error);
      toast.error('Erreur lors de la création du devis');
    }
  });
};

export const useUpdateQuoteStatus = () => {
  const queryClient = useQueryClient();
  const [localQuotes, setLocalQuotes] = useLocalStorage<Quote[]>('quotes', []);
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Quote['status'] }) => {
      console.log('Updating quote status:', id, status);
      
      // Mettre à jour localement d'abord
      setLocalQuotes(prev => 
        prev.map(quote => 
          quote.id === id 
            ? { ...quote, status, updated_at: new Date().toISOString() }
            : quote
        )
      );
      
      try {
        const { data, error } = await supabase
          .from('quotes')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating quote status in database:', error);
          toast.error('Erreur lors de la mise à jour, modification locale seulement');
          return { id, status };
        }
        
        console.log('Quote status updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, quote updated locally:', error);
        toast.error('Erreur réseau, modification locale seulement');
        return { id, status };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Statut du devis mis à jour avec succès !');
    },
    onError: (error) => {
      console.error('Error in useUpdateQuoteStatus:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  });
};
