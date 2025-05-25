
import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Tag, Receipt, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from '@/components/dashboard/StatCard';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'mobile';
  receipt?: string;
}

const ExpensesModule = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const expenses: Expense[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Achat rames de papier A4',
      category: 'Fournitures',
      amount: 15000,
      paymentMethod: 'cash'
    },
    {
      id: '2',
      date: '2024-01-14',
      description: 'Facture électricité',
      category: 'Charges',
      amount: 8000,
      paymentMethod: 'bank'
    },
    {
      id: '3',
      date: '2024-01-13',
      description: 'Maintenance imprimante',
      category: 'Maintenance',
      amount: 12000,
      paymentMethod: 'mobile'
    },
    {
      id: '4',
      date: '2024-01-12',
      description: 'Carburant générateur',
      category: 'Carburant',
      amount: 5000,
      paymentMethod: 'cash'
    },
  ];

  const categories = [
    'Fournitures', 'Charges', 'Maintenance', 'Carburant', 'Salaires', 'Transport', 'Communication'
  ];

  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyAverage = totalExpenses / 12;

  const ExpenseForm = ({ onSubmit, onCancel }: {
    onSubmit: (expense: Omit<Expense, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Fournitures',
      amount: 0,
      paymentMethod: 'cash' as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Ajouter une Dépense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Description de la dépense"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant (FCFA)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mode de Paiement</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="cash">Espèces</option>
                <option value="bank">Virement</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">Ajouter</Button>
              <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    // Logique d'ajout de dépense
    console.log('Nouvelle dépense:', expenseData);
    setShowAddForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Dépenses</h1>
          <p className="text-gray-600 mt-2">Suivi et contrôle des dépenses</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Dépense
        </Button>
      </div>

      {/* Résumé des dépenses */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Dépenses"
          value={`${totalExpenses.toLocaleString()} FCFA`}
          icon={TrendingDown}
          color="red"
          change="+5.2%"
          changeType="negative"
        />
        <StatCard
          title="Moyenne Mensuelle"
          value={`${monthlyAverage.toLocaleString()} FCFA`}
          icon={Calendar}
          color="orange"
          change="-2.1%"
          changeType="positive"
        />
        <StatCard
          title="Ce Mois"
          value="40 000 FCFA"
          icon={DollarSign}
          color="blue"
          change="+8.7%"
          changeType="negative"
        />
        <StatCard
          title="Catégories"
          value={categories.length.toString()}
          icon={Tag}
          color="green"
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? "default" : "outline"}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          Toutes
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

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Historique des Dépenses ({filteredExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Mode Paiement</TableHead>
                <TableHead className="text-right">Montant (FCFA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {new Date(expense.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                      expense.paymentMethod === 'bank' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {expense.paymentMethod === 'cash' ? 'Espèces' :
                       expense.paymentMethod === 'bank' ? 'Virement' : 'Mobile Money'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {expense.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAddForm && (
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default ExpensesModule;
