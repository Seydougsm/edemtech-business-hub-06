
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

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
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>('products', []);

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products from Supabase...');
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching products, using local data:', error);
          toast.warn('Utilisation des données locales pour les produits');
          return localProducts;
        }
        
        console.log('Products fetched successfully:', data);
        
        // Vérifier les alertes de stock
        if (data) {
          const lowStockProducts = data.filter(product => product.stock <= product.min_stock);
          if (lowStockProducts.length > 0) {
            toast.warning(`${lowStockProducts.length} produit(s) en stock faible!`);
          }
          setLocalProducts(data);
        }
        
        return data as Product[];
      } catch (error) {
        console.error('Network error, using local data:', error);
        toast.warn('Erreur réseau, utilisation des données locales');
        return localProducts;
      }
    }
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>('products', []);
  
  return useMutation({
    mutationFn: async (product: NewProduct) => {
      console.log('Creating product:', product);
      
      // Créer localement d'abord
      const newProduct = {
        ...product,
        id: `local_${Date.now()}`,
        unit_price: product.unit_price || product.price,
        min_stock: product.min_stock || 5,
        max_stock: product.max_stock || 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLocalProducts(prev => [...prev, newProduct]);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .insert({
            ...product,
            unit_price: product.unit_price || product.price
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating product in database:', error);
          toast.warn('Produit sauvegardé localement seulement');
          return newProduct;
        }
        
        console.log('Product created successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, product saved locally:', error);
        toast.warn('Produit sauvegardé localement seulement');
        return newProduct;
      }
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
  const [localProducts, setLocalProducts] = useLocalProducts<Product[]>('products', []);
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      console.log('Updating product:', id, updates);
      
      // Mettre à jour localement d'abord
      setLocalProducts(prev => 
        prev.map(product => {
          if (product.id === id) {
            const updatedProduct = { ...product, ...updates, updated_at: new Date().toISOString() };
            
            // Vérifier si le stock est faible après mise à jour
            if (updates.stock !== undefined && updatedProduct.stock <= updatedProduct.min_stock) {
              toast.warning(`Stock faible pour "${updatedProduct.name}": ${updatedProduct.stock} restant(s)`);
            }
            
            return updatedProduct;
          }
          return product;
        })
      );
      
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating product in database:', error);
          toast.warn('Produit mis à jour localement seulement');
          return { id, ...updates };
        }
        
        console.log('Product updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, product updated locally:', error);
        toast.warn('Produit mis à jour localement seulement');
        return { id, ...updates };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Produit mis à jour avec succès !`);
    },
    onError: (error) => {
      console.error('Error in useUpdateProduct:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>('products', []);
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      
      // Supprimer localement d'abord
      setLocalProducts(prev => prev.filter(product => product.id !== id));
      
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting product from database:', error);
          toast.warn('Produit supprimé localement seulement');
        } else {
          console.log('Product deleted successfully');
        }
      } catch (error) {
        console.error('Network error, product deleted locally:', error);
        toast.warn('Produit supprimé localement seulement');
      }
      
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
  const [localProducts, setLocalProducts] = useLocalStorage<Product[]>('products', []);
  
  return useMutation({
    mutationFn: async ({ productId, newStock }: { productId: string; newStock: number }) => {
      console.log('Updating stock for product:', productId, 'new stock:', newStock);
      
      // Mettre à jour le stock localement d'abord
      let updatedProduct: Product | null = null;
      setLocalProducts(prev => 
        prev.map(product => {
          if (product.id === productId) {
            updatedProduct = { ...product, stock: newStock, updated_at: new Date().toISOString() };
            
            // Vérifier les alertes de stock
            if (newStock <= product.min_stock) {
              toast.warning(`Stock critique pour "${product.name}": ${newStock} restant(s) (minimum: ${product.min_stock})`);
            }
            
            return updatedProduct;
          }
          return product;
        })
      );
      
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', productId)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating stock in database:', error);
          toast.warn('Stock mis à jour localement seulement');
          return updatedProduct;
        }
        
        console.log('Stock updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Network error, stock updated locally:', error);
        toast.warn('Stock mis à jour localement seulement');
        return updatedProduct;
      }
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
