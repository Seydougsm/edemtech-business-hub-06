
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from '@/components/dashboard/StatCard';

const AccountingModule = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const transactions = [
    { id: '1', date: '2024-01-15', type: 'Recette', description: 'Ventes photocopies', amount: 45000, category: 'Ventes' },
    { id: '2', date: '2024-01-14', type: 'Dépense', description: 'Achat papier', amount: -15000, category: 'Fournitures' },
    { id: '3', date: '2024-01-13', type: 'Recette', description: 'Formation informatique', amount: 50000, category: 'Formations' },
    { id: '4', date: '2024-01-12', type: 'Dépense', description: 'Électricité', amount: -8000, category: 'Charges' },
    { id: '5', date: '2024-01-11', type: 'Recette', description: 'Ventes WiFi', amount: 12000, category: 'Ventes' },
  ];

  const totalRecettes = transactions
    .filter(t => t.type === 'Recette')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDepenses = Math.abs(transactions
    .filter(t => t.type === 'Dépense')
    .reduce((sum, t) => sum + t.amount, 0));

  const benefice = totalRecettes - totalDepenses;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comptabilité</h1>
          <p className="text-gray-600 mt-2">Gestion comptable et financière</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              size="sm"
            >
              {period === 'week' ? 'Semaine' : 
               period === 'month' ? 'Mois' :
               period === 'quarter' ? 'Trimestre' : 'Année'}
            </Button>
          ))}
        </div>
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Recettes"
          value={`${totalRecettes.toLocaleString()} FCFA`}
          icon={TrendingUp}
          color="green"
          change="+15.2%"
          changeType="positive"
        />
        <StatCard
          title="Total Dépenses"
          value={`${totalDepenses.toLocaleString()} FCFA`}
          icon={TrendingDown}
          color="red"
          change="+8.1%"
          changeType="negative"
        />
        <StatCard
          title="Bénéfice Net"
          value={`${benefice.toLocaleString()} FCFA`}
          icon={DollarSign}
          color={benefice > 0 ? "green" : "red"}
          change="+23.4%"
          changeType="positive"
        />
        <StatCard
          title="Marge (%)"
          value={`${((benefice / totalRecettes) * 100).toFixed(1)}%`}
          icon={Calculator}
          color="blue"
          change="+2.1%"
          changeType="positive"
        />
      </div>

      {/* Journal des écritures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Journal des écritures comptables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Montant (FCFA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'Recette' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={`text-right font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Comptes de résultat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compte de Résultat - Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Fournitures', amount: 15000 },
                { label: 'Charges locatives', amount: 25000 },
                { label: 'Électricité', amount: 8000 },
                { label: 'Internet', amount: 12000 },
                { label: 'Maintenance', amount: 5000 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>{item.label}</span>
                  <span className="font-bold text-red-600">{item.amount.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compte de Résultat - Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Ventes photocopies', amount: 45000 },
                { label: 'Formations', amount: 50000 },
                { label: 'Ventes WiFi', amount: 12000 },
                { label: 'Fournitures bureau', amount: 18000 },
                { label: 'Services divers', amount: 8000 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>{item.label}</span>
                  <span className="font-bold text-green-600">{item.amount.toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountingModule;
