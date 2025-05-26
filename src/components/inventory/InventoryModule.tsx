
import React, { useState } from 'react';
import { Package, AlertTriangle, Download, BarChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from '@/components/dashboard/StatCard';
import ProductManager from './ProductManager';
import { useProducts } from '@/hooks/useProducts';

const InventoryModule = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('inventory');

  const { data: products = [], isLoading } = useProducts();

  const categories = ['photocopie', 'impression', 'saisie', 'wifi', 'fourniture', 'consommables', 'informatique'];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(item => item.category === selectedCategory);

  const lowStockItems = products.filter(item => item.stock <= item.min_stock);
  const totalValue = products.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const totalItems = products.reduce((sum, item) => sum + item.stock, 0);

  const getStockStatus = (item: any) => {
    if (item.stock <= item.min_stock) return 'low';
    if (item.stock >= item.max_stock) return 'high';
    return 'normal';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600';
      case 'high': return 'text-blue-600';
      default: return 'text-green-600';
    }
  };

  const generateReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      products: products,
      summary: {
        totalValue,
        totalItems,
        lowStockCount: lowStockItems.length,
        categoriesCount: categories.length
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-inventaire-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-6">Chargement de l'inventaire...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion d'Inventaire</h1>
          <p className="text-gray-600 mt-2">Suivi des stocks et approvisionnements</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'inventory'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Vue Inventaire
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'manage'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Gérer Produits
        </button>
      </div>

      {activeTab === 'manage' ? (
        <ProductManager />
      ) : (
        <>
          {/* Statistiques inventaire */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Valeur Totale Stock"
              value={`${totalValue.toLocaleString()} FCFA`}
              icon={Package}
              color="blue"
              change="+3.2%"
              changeType="positive"
            />
            <StatCard
              title="Articles en Stock"
              value={totalItems.toString()}
              icon={BarChart}
              color="green"
              change="+12"
              changeType="positive"
            />
            <StatCard
              title="Stock Bas"
              value={lowStockItems.length.toString()}
              icon={AlertTriangle}
              color="red"
              change="+2"
              changeType="negative"
            />
            <StatCard
              title="Catégories"
              value={categories.length.toString()}
              icon={Package}
              color="orange"
            />
          </div>

          {/* Alertes stock bas */}
          {lowStockItems.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes Stock Bas ({lowStockItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="p-3 bg-white rounded border border-red-200">
                      <p className="font-medium text-red-800">{item.name}</p>
                      <p className="text-sm text-red-600">
                        Stock: {item.stock} / Min: {item.min_stock}
                      </p>
                      <Button size="sm" className="mt-2 w-full">Réapprovisionner</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Toutes Catégories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Table d'inventaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventaire Détaillé ({filteredProducts.length} articles)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedCategory === 'all' 
                      ? 'Commencez par ajouter des produits' 
                      : `Aucun produit dans la catégorie "${selectedCategory}"`}
                  </p>
                  <Button onClick={() => setActiveTab('manage')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Stock Actuel</TableHead>
                      <TableHead>Stock Min/Max</TableHead>
                      <TableHead>Prix Unitaire</TableHead>
                      <TableHead>Valeur Totale</TableHead>
                      <TableHead>Fournisseur</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((item) => {
                      const status = getStockStatus(item);
                      const totalValue = item.price * item.stock;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {item.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${getStockColor(status)}`}>
                              {item.stock}
                            </span>
                            {status === 'low' && (
                              <AlertTriangle className="inline h-4 w-4 text-red-500 ml-1" />
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {item.min_stock} / {item.max_stock}
                            </span>
                          </TableCell>
                          <TableCell>{item.price.toLocaleString()} FCFA</TableCell>
                          <TableCell className="font-bold">
                            {totalValue.toLocaleString()} FCFA
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {item.supplier || 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default InventoryModule;
