
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Package, Wrench } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  min_stock?: number;
  unit?: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const isService = (product: Product) => {
    return ['photocopie', 'saisie', 'impression', 'wifi'].includes(product.category);
  };

  const getStockStatus = (product: Product) => {
    if (!product.stock || !product.min_stock) return 'service';
    if (product.stock <= product.min_stock) return 'critical';
    if (product.stock <= product.min_stock * 2) return 'low';
    return 'normal';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'service': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getIcon = (product: Product) => {
    return isService(product) ? (
      <Wrench className="h-4 w-4 text-blue-600" />
    ) : (
      <Package className="h-4 w-4 text-green-600" />
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product);
        const isProductDisabled = stockStatus === 'critical' && !isService(product);
        
        return (
          <Card 
            key={product.id} 
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 ${
              isService(product) ? 'border-l-blue-500' : 'border-l-green-500'
            } ${isProductDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isProductDisabled && onAddToCart(product)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(product)}
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    {isService(product) ? 'Service' : 'Produit'}
                  </span>
                </div>
                
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-800">
                  {product.name}
                </h3>
                
                <div className="mt-auto">
                  <p className="text-lg font-bold text-green-600 mb-2">
                    {product.price.toLocaleString()} FCFA
                    {product.unit && <span className="text-xs text-gray-500">/{product.unit}</span>}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    {isService(product) ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        Service
                      </span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded-full ${getStockColor(stockStatus)}`}>
                        {stockStatus === 'critical' ? (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Épuisé
                          </div>
                        ) : (
                          `Stock: ${product.stock || 0}`
                        )}
                      </span>
                    )}
                  </div>
                  
                  {isProductDisabled && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Produit non disponible
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductGrid;
