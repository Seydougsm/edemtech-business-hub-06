
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-blue-500"
          onClick={() => onAddToCart(product)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-800">{product.name}</h3>
              <div className="mt-auto">
                <p className="text-lg font-bold text-green-600 mb-1">{product.price.toLocaleString()} FCFA</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.stock > 20 ? 'bg-green-100 text-green-800' : 
                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
