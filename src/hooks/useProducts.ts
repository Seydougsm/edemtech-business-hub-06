
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  unit_price?: number;
  supplier?: string;
  created_at?: string;
  updated_at?: string;
}

interface NewProduct {
  name: string;
  price: number;
  category: string;
  stock: number;
  min_stock?: number;
  max_stock?: number;
  unit_price?: number;
  supplier?: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      console.log('Products fetched successfully:', data);
      return data as Product[];
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: NewProduct) => {
      console.log('Creating product:', product);
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          unit_price: product.unit_price || product.price
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      console.log('Product created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Produit "${data.name}" créé avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useCreateProduct:', error);
      toast.error('Erreur lors de la création du produit');
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      console.log('Updating product:', id, updates);
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      console.log('Product updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Produit "${data.name}" mis à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateProduct:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      console.log('Product deleted successfully');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé avec succès !');
    },
    onError: (error) => {
      console.error('Error in useDeleteProduct:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, newStock }: { productId: string; newStock: number }) => {
      console.log('Updating stock for product:', productId, 'new stock:', newStock);
      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating stock:', error);
        throw error;
      }
      console.log('Stock updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error in useUpdateStock:', error);
      toast.error('Erreur lors de la mise à jour du stock');
    }
  });
};
