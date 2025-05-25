
import React, { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProductGrid from './ProductGrid';
import CategoryFilter from './CategoryFilter';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import SearchBar from './SearchBar';

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
  const [searchTerm, setSearchTerm] = useState('');

  const products: Product[] = [
    { id: '1', name: 'Photocopie N&B A4', price: 25, category: 'photocopie', stock: 1000 },
    { id: '2', name: 'Photocopie Couleur A4', price: 100, category: 'photocopie', stock: 500 },
    { id: '3', name: 'Impression A4', price: 150, category: 'impression', stock: 300 },
    { id: '4', name: 'Saisie document', price: 200, category: 'saisie', stock: 100 },
    { id: '5', name: 'Ticket Wifi 1h', price: 200, category: 'wifi', stock: 50 },
    { id: '6', name: 'Rame papier A4', price: 2500, category: 'fourniture', stock: 20 },
    { id: '7', name: 'Chemise A4', price: 300, category: 'fourniture', stock: 35 },
    { id: '8', name: 'Photocopie N&B A3', price: 50, category: 'photocopie', stock: 200 },
    { id: '9', name: 'Clé USB 16GB', price: 8000, category: 'fourniture', stock: 15 },
    { id: '10', name: 'Ticket Wifi 3h', price: 500, category: 'wifi', stock: 30 },
  ];

  const categories = [
    { id: 'all', name: 'Tous', color: 'bg-gray-100' },
    { id: 'photocopie', name: 'Photocopie', color: 'bg-blue-100' },
    { id: 'impression', name: 'Impression', color: 'bg-green-100' },
    { id: 'saisie', name: 'Saisie', color: 'bg-purple-100' },
    { id: 'wifi', name: 'Wifi', color: 'bg-cyan-100' },
    { id: 'fourniture', name: 'Fournitures', color: 'bg-orange-100' },
  ];

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    setSearchTerm('');
  };

  const processPayment = () => {
    // Enhanced payment processing with better UX
    const receiptData = {
      items: cart,
      subtotal,
      discount,
      total,
      customerName,
      timestamp: new Date().toLocaleString('fr-FR')
    };
    
    console.log('Processing payment:', receiptData);
    alert(`✅ Paiement de ${total.toLocaleString()} FCFA traité avec succès!\n\nClient: ${customerName || 'Client anonyme'}\nArticles: ${cart.length}\nTotal: ${total.toLocaleString()} FCFA`);
    clearCart();
  };

  const printReceipt = () => {
    console.log('Printing receipt for cart:', cart);
    alert('🖨️ Impression du reçu en cours...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Point de Vente (POS)</h1>
          <p className="text-gray-600">Interface de vente rapide et intuitive - EDEM TECH SOLUTION</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Category Filter */}
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            {/* Products Grid */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedCategory === 'all' ? 'Tous les produits' : 
                   categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} produit(s)
                </span>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Aucun produit trouvé</p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              ) : (
                <ProductGrid 
                  products={filteredProducts}
                  onAddToCart={addToCart}
                />
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-4">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Panier ({cart.length} articles)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="h-4 w-4" />
                    Client
                  </div>
                  <Input
                    placeholder="Nom du client (optionnel)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Panier vide</p>
                      <p className="text-sm">Sélectionnez des produits pour commencer</p>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {cart.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Summary */}
                <CartSummary
                  subtotal={subtotal}
                  discount={discount}
                  total={total}
                  onDiscountChange={setDiscount}
                  onProcessPayment={processPayment}
                  onClearCart={clearCart}
                  onPrintReceipt={printReceipt}
                  isEmpty={cart.length === 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSModule;
