
import React, { useState } from 'react';
import { Plus, Package, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServicesSection from './ServicesSection';
import ProductsSection from './ProductsSection';
import { exportActivities } from '@/hooks/useLocalStorage';

const ServicesManagement = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services & Produits</h1>
          <p className="text-gray-600 mt-2">Gérez vos services et produits de façon professionnelle</p>
        </div>
        <Button onClick={exportActivities} variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Exporter Activités
        </Button>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'services'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Services
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="h-4 w-4" />
          Produits
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'services' ? <ServicesSection /> : <ProductsSection />}
    </div>
  );
};

export default ServicesManagement;
