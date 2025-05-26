
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductForm from './ProductForm';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';

const ProductsSection = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { data: products = [], isLoading } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const lowStockProducts = products.filter(product => product.stock <= product.min_stock);

  const handleAddProduct = async (productData: any) => {
    try {
      await createProductMutation.mutateAsync(productData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    }
  };

  const handleEditProduct = async (productData: any) => {
    if (editingProduct) {
      try {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          updates: productData
        });
        setEditingProduct(null);
      } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
      }
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
      }
    }
  };

  const getStockStatus = (product: any) => {
    if (product.stock <= product.min_stock) return 'critical';
    if (product.stock <= product.min_stock * 2) return 'low';
    return 'normal';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des produits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Produits ({products.length})</h2>
          {lowStockProducts.length > 0 && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              {lowStockProducts.length} en stock faible
            </span>
          )}
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {/* Alertes de stock faible */}
      {lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Produits en stock faible ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-3 bg-white rounded border border-red-200">
                  <p className="font-medium text-red-800">{product.name}</p>
                  <p className="text-sm text-red-600">
                    Stock: {product.stock} / Min: {product.min_stock}
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => setEditingProduct(product)}
                  >
                    Réapprovisionner
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier produit</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const stockStatus = getStockStatus(product);
            const stockColor = getStockColor(stockStatus);
            const totalValue = product.price * product.stock;
            
            return (
              <Card key={product.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      <span className="text-sm text-gray-500">par unité</span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-sm font-medium ${stockColor}`}>
                      Stock: {product.stock} unités
                      {stockStatus === 'critical' && (
                        <AlertTriangle className="inline h-4 w-4 ml-1" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Min: {product.min_stock} | Max: {product.max_stock}</p>
                      <p className="font-medium">Valeur stock: {totalValue.toLocaleString()} FCFA</p>
                      {product.supplier && (
                        <p>Fournisseur: {product.supplier}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsSection;
