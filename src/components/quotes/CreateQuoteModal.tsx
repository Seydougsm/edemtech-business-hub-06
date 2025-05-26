
import React, { useState, useMemo } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProducts } from '@/hooks/useProducts';
import { useServices } from '@/hooks/useServices';
import { useCreateQuote } from '@/hooks/useQuotes';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateQuoteModal = ({ isOpen, onClose }: CreateQuoteModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products = [] } = useProducts();
  const { data: services = [] } = useServices();
  const createQuoteMutation = useCreateQuote();

  const allItems = useMemo(() => {
    const serviceItems = services.map(service => ({
      ...service,
      type: 'service' as const
    }));
    
    const productItems = products.map(product => ({
      ...product,
      unit: 'unité',
      type: 'product' as const
    }));
    
    return [...serviceItems, ...productItems];
  }, [services, products]);

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (item) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(selected =>
          selected.id === item.id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        )
      );
    } else {
      setSelectedItems(prev => [
        ...prev,
        { ...item, quantity: 1 }
      ]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      setSelectedItems(prev => prev.filter(item => item.id !== id));
    } else {
      setSelectedItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      return;
    }

    const quoteData = {
      customer_name: customerName || undefined,
      customer_phone: customerPhone || undefined,
      customer_email: customerEmail || undefined,
      items: selectedItems,
      subtotal,
      discount,
      total,
      valid_until: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    try {
      await createQuoteMutation.mutateAsync(quoteData);
      onClose();
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setValidUntil('');
      setDiscount(0);
      setSelectedItems([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle>Créer un Nouveau Devis</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="customerName">Nom du client</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Téléphone</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Numéro de téléphone"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Adresse email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validUntil">Valide jusqu'au</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="discount">Remise (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Items Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Articles disponibles</h3>
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItem(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Articles sélectionnés</h3>
                <div className="space-y-2 mb-4">
                  {selectedItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-medium w-20 text-right">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span>Remise ({discount}%):</span>
                      <span>-{discountAmount.toLocaleString()} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={selectedItems.length === 0 || createQuoteMutation.isPending}
              >
                {createQuoteMutation.isPending ? 'Création...' : 'Créer le Devis'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuoteModal;
