
import React, { useState } from 'react';
import { Plus, Minus, Trash2, Calculator, CreditCard, Receipt, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

const POSModule = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);

  const products: Product[] = [
    { id: '1', name: 'Photocopie N&B A4', price: 25, category: 'photocopie', stock: 1000 },
    { id: '2', name: 'Photocopie Couleur A4', price: 100, category: 'photocopie', stock: 500 },
    { id: '3', name: 'Impression A4', price: 150, category: 'impression', stock: 300 },
    { id: '4', name: 'Saisie document', price: 200, category: 'saisie', stock: 100 },
    { id: '5', name: 'Ticket Wifi 1h', price: 200, category: 'wifi', stock: 50 },
    { id: '6', name: 'Rame papier A4', price: 2500, category: 'fourniture', stock: 20 },
    { id: '7', name: 'Chemise A4', price: 300, category: 'fourniture', stock: 35 },
  ];

  const categories = [
    { id: 'all', name: 'Tous', color: 'bg-gray-100' },
    { id: 'photocopie', name: 'Photocopie', color: 'bg-blue-100' },
    { id: 'impression', name: 'Impression', color: 'bg-green-100' },
    { id: 'saisie', name: 'Saisie', color: 'bg-purple-100' },
    { id: 'wifi', name: 'Wifi', color: 'bg-cyan-100' },
    { id: 'fourniture', name: 'Fournitures', color: 'bg-orange-100' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDiscount(0);
  };

  const processPayment = () => {
    // Logique de traitement du paiement
    alert(`Paiement de ${total.toLocaleString()} FCFA traité avec succès!`);
    clearCart();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Point de Vente (POS)</h1>
        <p className="text-gray-600 mt-2">Interface de vente rapide et intuitive</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection des produits */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Grille des produits */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-green-600">{product.price.toLocaleString()} FCFA</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Panier et facturation */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Panier ({cart.length} articles)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations client */}
              <div>
                <Input
                  placeholder="Nom du client (optionnel)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* Articles du panier */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-green-600 font-bold">{item.price.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length === 0 && (
                <p className="text-center text-gray-500 py-4">Panier vide</p>
              )}

              {/* Remise */}
              {cart.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Remise (%):</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  {/* Récapitulatif */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Remise ({discount}%):</span>
                        <span>-{discountAmount.toLocaleString()} FCFA</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-green-600">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-2">
                    <Button 
                      onClick={processPayment} 
                      className="w-full"
                      disabled={cart.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Encaisser
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={clearCart}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Vider
                      </Button>
                      <Button variant="outline">
                        <Receipt className="h-4 w-4 mr-1" />
                        Imprimer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POSModule;
