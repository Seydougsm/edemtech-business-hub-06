
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
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
}

const ProductManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    min_stock: 0,
    max_stock: 100,
    supplier: ''
  });

  const { data: products = [], isLoading } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const categories = [
    'photocopie', 'impression', 'saisie', 'wifi', 'fourniture', 'consommables', 'informatique'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: '',
      stock: 0,
      min_stock: 0,
      max_stock: 100,
      supplier: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          updates: formData
        });
      } else {
        await createProductMutation.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      min_stock: product.min_stock,
      max_stock: product.max_stock,
      supplier: product.supplier || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement des produits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du produit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix unitaire (FCFA) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock initial
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock minimum
                  </label>
                  <Input
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock maximum
                  </label>
                  <Input
                    type="number"
                    value={formData.max_stock}
                    onChange={(e) => setFormData({ ...formData, max_stock: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fournisseur
                  </label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="Nom du fournisseur"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                  {editingProduct ? 'Modifier' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Catégorie:</span> {product.category}</p>
                <p><span className="font-medium">Prix:</span> {product.price.toLocaleString()} FCFA</p>
                <p><span className="font-medium">Stock:</span> {product.stock}</p>
                <p><span className="font-medium">Min/Max:</span> {product.min_stock}/{product.max_stock}</p>
                {product.supplier && (
                  <p><span className="font-medium">Fournisseur:</span> {product.supplier}</p>
                )}
              </div>
              
              {product.stock <= product.min_stock && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
                  Stock faible !
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier produit</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManager;
