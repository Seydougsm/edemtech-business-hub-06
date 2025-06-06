import React, { useState, useMemo } from 'react';
import { ShoppingCart, User, Minus, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProductGrid from './ProductGrid';
import CategoryFilter from './CategoryFilter';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import SearchBar from './SearchBar';
import ExpenseModal from './ExpenseModal';
import InvoiceModal from './InvoiceModal';
import CategoryColorCustomizer from './CategoryColorCustomizer';
import { useProducts } from '@/hooks/useProducts';
import { useServices } from '@/hooks/useServices';
import { useCreateSale } from '@/hooks/useSales';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  type: 'service' | 'product';
}

const POSModule = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isColorCustomizerOpen, setIsColorCustomizerOpen] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const createSaleMutation = useCreateSale();
  const { categories: categoryColors } = useCategoryColors();

  // Combiner services et produits
  const allItems = useMemo(() => {
    const serviceItems = services.map(service => ({
      ...service,
      stock: undefined,
      min_stock: undefined,
      type: 'service' as const
    }));
    
    const productItems = products.map(product => ({
      ...product,
      unit: 'unité',
      type: 'product' as const
    }));
    
    return [...serviceItems, ...productItems];
  }, [services, products]);

  const categories = [
    { id: 'all', name: 'Tous', color: 'bg-gray-100' },
    { id: 'photocopie', name: 'Photocopie', color: 'bg-blue-100' },
    { id: 'impression', name: 'Impression', color: 'bg-green-100' },
    { id: 'saisie', name: 'Saisie', color: 'bg-purple-100' },
    { id: 'wifi', name: 'Wifi', color: 'bg-cyan-100' },
    { id: 'fourniture', name: 'Fournitures', color: 'bg-orange-100' },
    { id: 'consommables', name: 'Consommables', color: 'bg-pink-100' },
    { id: 'informatique', name: 'Informatique', color: 'bg-indigo-100' },
  ];

  // Filter items based on category and search term
  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: any) => {
    // Vérifier si c'est un produit et s'il a du stock
    if (item.type === 'product' && item.stock <= 0) {
      toast.error('Produit en rupture de stock');
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      // Vérifier si on peut ajouter plus pour les produits
      if (item.type === 'product' && existingItem.quantity >= item.stock) {
        toast.error('Stock insuffisant');
        return;
      }
      
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category,
        type: item.type
      }]);
    }
    
    console.log('Item added to cart:', item.name, 'Type:', item.type);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      // Vérifier le stock pour les produits
      const cartItem = cart.find(item => item.id === id);
      const originalItem = allItems.find(item => item.id === id);
      
      if (originalItem?.type === 'product' && originalItem.stock && newQuantity > originalItem.stock) {
        toast.error('Quantité demandée supérieure au stock disponible');
        return;
      }
      
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

  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error('Le panier est vide');
      return;
    }

    try {
      const saleData = {
        items: cart,
        subtotal,
        discount,
        total,
        customerName,
        paymentMethod: 'cash' as const
      };

      const sale = await createSaleMutation.mutateAsync(saleData);
      setLastSale({ ...sale, items: cart });
      
      toast.success(`Paiement de ${total.toLocaleString()} FCFA traité avec succès!`);
      clearCart();
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error);
      toast.error('Erreur lors du traitement du paiement');
    }
  };

  const printReceipt = () => {
    if (lastSale) {
      setIsInvoiceModalOpen(true);
    } else {
      toast.error('Aucune vente récente à imprimer');
    }
  };

  if (loadingProducts || loadingServices) {
    return <div className="p-6">Chargement des produits et services...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Point de Vente (POS)</h1>
            <p className="text-gray-600">
              Interface de vente rapide et intuitive - {allItems.length} articles disponibles
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsColorCustomizerOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Couleurs
            </Button>
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Minus className="h-4 w-4 mr-2" />
              Dépenses
            </Button>
          </div>
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
              categories={categoryColors}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            {/* Products Grid */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedCategory === 'all' ? 'Tous les articles' : 
                   categoryColors.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredItems.length} article(s)
                </span>
              </div>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Aucun article trouvé</p>
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
                  products={filteredItems}
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
                      <p className="text-sm">Sélectionnez des articles pour commencer</p>
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

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        sale={lastSale}
      />

      <CategoryColorCustomizer
        isOpen={isColorCustomizerOpen}
        onClose={() => setIsColorCustomizerOpen(false)}
      />
    </div>
  );
};

export default POSModule;
