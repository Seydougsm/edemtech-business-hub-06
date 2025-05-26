
import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCreateExpense } from '@/hooks/useExpenses';
import { toast } from 'sonner';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExpenseModal = ({ isOpen, onClose }: ExpenseModalProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'mobile'>('cash');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [notes, setNotes] = useState('');

  const createExpenseMutation = useCreateExpense();

  const categories = [
    'Achat de marchandises',
    'Frais de fonctionnement',
    'Salaires',
    'Loyer',
    'Électricité',
    'Internet',
    'Transport',
    'Maintenance',
    'Fournitures bureau',
    'Autres'
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Espèces', icon: '💵' },
    { value: 'bank', label: 'Virement bancaire', icon: '🏦' },
    { value: 'mobile', label: 'Mobile Money', icon: '📱' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        description,
        amount: numericAmount,
        category,
        payment_method: paymentMethod,
        receipt_number: receiptNumber || undefined,
        notes: notes || undefined
      });

      // Reset form
      setDescription('');
      setAmount('');
      setCategory('');
      setPaymentMethod('cash');
      setReceiptNumber('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la dépense:', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setPaymentMethod('cash');
    setReceiptNumber('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Enregistrer une Dépense
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez la dépense..."
                className="w-full"
                required
              />
            </div>

            {/* Montant et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Montant (FCFA) *
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mode de paiement
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value as any)}
                    className={`p-3 border rounded-lg flex items-center gap-2 transition-all ${
                      paymentMethod === method.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro de reçu */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Numéro de reçu (optionnel)
              </label>
              <Input
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Ex: REC-001"
                className="w-full"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes additionnelles (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
                placeholder="Informations supplémentaires..."
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 order-2 sm:order-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 order-1 sm:order-2"
                disabled={createExpenseMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {createExpenseMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseModal;
