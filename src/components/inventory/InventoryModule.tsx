
import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Download, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from '@/components/dashboard/StatCard';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastUpdated: string;
  supplier?: string;
}

const InventoryModule = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const inventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Rame Papier A4 80g',
      category: 'Papeterie',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unitPrice: 2500,
      totalValue: 62500,
      lastUpdated: '2024-01-15',
      supplier: 'Papeterie Centrale'
    },
    {
      id: '2',
      name: 'Toner HP LaserJet',
      category: 'Consommables',
      currentStock: 3,
      minStock: 5,
      maxStock: 15,
      unitPrice: 45000,
      totalValue: 135000,
      lastUpdated: '2024-01-14',
      supplier: 'Tech Solutions'
    },
    {
      id: '3',
      name: 'Chemise A4 Plastique',
      category: 'Papeterie',
      currentStock: 150,
      minStock: 50,
      maxStock: 200,
      unitPrice: 300,
      totalValue: 45000,
      lastUpdated: '2024-01-13',
      supplier: 'Bureau Plus'
    },
    {
      id: '4',
      name: 'Clé USB 16GB',
      category: 'Informatique',
      currentStock: 8,
      minStock: 10,
      maxStock: 30,
      unitPrice: 8000,
      totalValue: 64000,
      lastUpdated: '2024-01-12',
      supplier: 'IT Store'
    },
    {
      id: '5',
      name: 'Encre Imprimante Couleur',
      category: 'Consommables',
      currentStock: 12,
      minStock: 8,
      maxStock: 25,
      unitPrice: 15000,
      totalValue: 180000,
      lastUpdated: '2024-01-11',
      supplier: 'Print Center'
    },
  ];

  const categories = ['Papeterie', 'Consommables', 'Informatique', 'Mobilier'];

  const filteredInventory = selectedCategory === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.currentStock, 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock) return 'high';
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
    // Logique de génération de rapport d'inventaire
    alert('Rapport d\'inventaire généré avec succès !');
  };

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
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter Article
          </Button>
        </div>
      </div>

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
                    Stock: {item.currentStock} / Min: {item.minStock}
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
            Inventaire Détaillé ({filteredInventory.length} articles)
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableHead>Dernière MAJ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const status = getStockStatus(item);
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
                        {item.currentStock}
                      </span>
                      {status === 'low' && (
                        <AlertTriangle className="inline h-4 w-4 text-red-500 ml-1" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {item.minStock} / {item.maxStock}
                      </span>
                    </TableCell>
                    <TableCell>{item.unitPrice.toLocaleString()} FCFA</TableCell>
                    <TableCell className="font-bold">
                      {item.totalValue.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {item.supplier || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(item.lastUpdated).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryModule;
