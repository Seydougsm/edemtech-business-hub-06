
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: SaleData) => {
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
      
      if (saleError) throw saleError;
      
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
        
        if (itemError) throw itemError;
        
        // Mettre à jour le stock du produit
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();
        
        if (productError) throw productError;
        
        const newStock = product.stock - item.quantity;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
        
        if (updateError) throw updateError;
        
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
        
        if (movementError) throw movementError;
      }
      
      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    }
  });
};
