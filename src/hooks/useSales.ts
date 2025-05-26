
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface SaleData {
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerName: string;
  paymentMethod: 'cash' | 'bank' | 'mobile';
}

interface Sale {
  id: string;
  sale_number: string;
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
  items?: SaleItem[];
}

export const useSales = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['sales', startDate, endDate],
    queryFn: async () => {
      console.log('Fetching sales from Supabase...');
      let query = supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_name,
            quantity,
            unit_price,
            total
          )
        `)
        .order('created_at', { ascending: false });
      
      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching sales:', error);
        throw error;
      }
      console.log('Sales fetched successfully:', data);
      return data as Sale[];
    }
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: SaleData) => {
      console.log('Creating sale:', saleData);
      
      // Générer le numéro de vente
      const saleNumber = `INV-${Date.now()}`;
      
      // Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_number: saleNumber,
          customer_name: saleData.customerName || null,
          subtotal: saleData.subtotal,
          discount: saleData.discount,
          total: saleData.total,
          payment_method: saleData.paymentMethod
        })
        .select()
        .single();
      
      if (saleError) {
        console.error('Error creating sale:', saleError);
        throw saleError;
      }
      
      console.log('Sale created, now creating sale items...');
      
      // Créer les articles de vente et mettre à jour le stock
      for (const item of saleData.items) {
        // Insérer l'article de vente
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert({
            sale_id: sale.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total: item.price * item.quantity
          });
        
        if (itemError) {
          console.error('Error creating sale item:', itemError);
          throw itemError;
        }
        
        // Mettre à jour le stock du produit
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
        
        if (productError) {
          console.error('Error fetching product stock:', productError);
          throw productError;
        }
        
        const newStock = product.stock - item.quantity;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
        
        if (updateError) {
          console.error('Error updating product stock:', updateError);
          throw updateError;
        }
        
        // Enregistrer le mouvement d'inventaire
        const { error: movementError } = await supabase
          .from('inventory_movements')
          .insert({
            product_id: item.id,
            movement_type: 'out',
            quantity: -item.quantity,
            previous_stock: product.stock,
            new_stock: newStock,
            reason: 'Vente',
            reference_id: sale.id,
            reference_type: 'sale'
          });
        
        if (movementError) {
          console.error('Error creating inventory movement:', movementError);
          throw movementError;
        }
      }
      
      console.log('Sale completed successfully:', sale);
      return sale;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_movements'] });
      toast.success(`Vente ${data.sale_number} enregistrée avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateSale:', error);
      toast.error('Erreur lors de l\'enregistrement de la vente');
    }
  });
};
