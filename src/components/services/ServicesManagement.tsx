
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Service {
  id: string;
  name: string;
  category: 'photocopie' | 'saisie' | 'impression' | 'fourniture' | 'wifi';
  price: number;
  unit: string;
  description?: string;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Photocopie N&B A4', category: 'photocopie', price: 25, unit: 'page' },
    { id: '2', name: 'Photocopie Couleur A4', category: 'photocopie', price: 100, unit: 'page' },
    { id: '3', name: 'Photocopie N&B A3', category: 'photocopie', price: 50, unit: 'page' },
    { id: '4', name: 'Saisie de document', category: 'saisie', price: 200, unit: 'page' },
    { id: '5', name: 'Impression couleur A4', category: 'impression', price: 150, unit: 'page' },
    { id: '6', name: 'Rame de papier A4', category: 'fourniture', price: 2500, unit: 'rame' },
    { id: '7', name: 'Chemise A4', category: 'fourniture', price: 300, unit: 'pièce' },
    { id: '8', name: 'Ticket Wifi 1h', category: 'wifi', price: 200, unit: 'ticket' },
    { id: '9', name: 'Ticket Wifi 3h', category: 'wifi', price: 500, unit: 'ticket' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const categories = {
    photocopie: { label: 'Photocopie', color: 'bg-blue-100 text-blue-800' },
    saisie: { label: 'Saisie', color: 'bg-green-100 text-green-800' },
    impression: { label: 'Impression', color: 'bg-purple-100 text-purple-800' },
    fourniture: { label: 'Fourniture', color: 'bg-orange-100 text-orange-800' },
    wifi: { label: 'Wifi', color: 'bg-cyan-100 text-cyan-800' },
  };

  const ServiceForm = ({ service, onSubmit, onCancel }: {
    service?: Service;
    onSubmit: (service: Omit<Service, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: service?.name || '',
      category: service?.category || 'photocopie',
      price: service?.price || 0,
      unit: service?.unit || 'page',
      description: service?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData as Omit<Service, 'id'>);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {service ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du service</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {Object.entries(categories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (FCFA)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unité</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                {service ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleAddService = (serviceData: Omit<Service, 'id'>) => {
    const newService = { ...serviceData, id: Date.now().toString() };
    setServices([...services, newService]);
    setShowAddForm(false);
  };

  const handleEditService = (serviceData: Omit<Service, 'id'>) => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? { ...serviceData, id: editingService.id } : s
      ));
      setEditingService(null);
    }
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services & Produits</h1>
          <p className="text-gray-600 mt-2">Gérez vos services et produits</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories[service.category].color}`}>
                  {categories[service.category].label}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {service.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-sm text-gray-500">/{service.unit}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingService(service)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <ServiceForm
          onSubmit={handleAddService}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onSubmit={handleEditService}
          onCancel={() => setEditingService(null)}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
