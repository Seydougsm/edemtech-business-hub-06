
import React, { useState } from 'react';
import { Calendar, Printer, Download, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';

const InventoryReportModule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: products = [], isLoading } = useProducts();

  const handlePrint = () => {
    window.print();
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockItems = products.filter(product => product.stock <= product.min_stock);

  if (isLoading) {
    return <div className="p-6">Chargement de l'inventaire...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapport d'Inventaire</h1>
          <p className="text-gray-600 mt-2">Gestion et impression des inventaires</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="print:hidden">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Sélection de date */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sélectionner la Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <span className="text-sm text-gray-600">
              Inventaire au {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Résumé de l'inventaire */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold">{totalValue.toLocaleString()} FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Stock Faible</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* En-tête du rapport (visible uniquement à l'impression) */}
      <div className="hidden print:block text-center mb-6 border-b-2 border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-blue-600">EDEM TECH SOLUTION</h1>
        <p className="text-gray-600">Kara, 2ème vont à droite, Station CAP Tomdè, Togo</p>
        <p className="text-gray-600">Tél: +228 98518686</p>
        <h2 className="text-xl font-bold mt-4">RAPPORT D'INVENTAIRE</h2>
        <p className="text-gray-600">Date: {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
      </div>

      {/* Tableau de l'inventaire */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire Détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-center">Stock Actuel</TableHead>
                <TableHead className="text-center">Stock Min.</TableHead>
                <TableHead className="text-right">Prix Unitaire</TableHead>
                <TableHead className="text-right">Valeur Stock</TableHead>
                <TableHead className="text-center">État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">{product.min_stock}</TableCell>
                  <TableCell className="text-right">{product.price.toLocaleString()} FCFA</TableCell>
                  <TableCell className="text-right">
                    {(product.price * product.stock).toLocaleString()} FCFA
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.stock <= product.min_stock 
                        ? 'bg-red-100 text-red-800' 
                        : product.stock <= product.min_stock * 2
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock <= product.min_stock 
                        ? 'Stock faible' 
                        : product.stock <= product.min_stock * 2
                        ? 'Attention'
                        : 'Normal'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Articles en stock faible */}
      {lowStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Articles en Stock Faible</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead className="text-center">Stock Actuel</TableHead>
                  <TableHead className="text-center">Stock Min.</TableHead>
                  <TableHead>Fournisseur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-center text-red-600 font-bold">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-center">{product.min_stock}</TableCell>
                    <TableCell>{product.supplier || 'Non défini'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pied de page du rapport (visible uniquement à l'impression) */}
      <div className="hidden print:block text-center text-sm text-gray-600 border-t pt-4 mt-6">
        <p>Rapport généré automatiquement le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
        <p>EDEM TECH SOLUTION - Système de Gestion</p>
      </div>
    </div>
  );
};

export default InventoryReportModule;
