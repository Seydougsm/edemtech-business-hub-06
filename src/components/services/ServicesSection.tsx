
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ServiceForm from './ServiceForm';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useServices';

const ServicesSection = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const { data: services = [], isLoading } = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const categories = {
    photocopie: { label: 'Photocopie', color: 'bg-blue-100 text-blue-800', icon: '📄' },
    saisie: { label: 'Saisie', color: 'bg-green-100 text-green-800', icon: '⌨️' },
    impression: { label: 'Impression', color: 'bg-purple-100 text-purple-800', icon: '🖨️' },
    wifi: { label: 'Wifi', color: 'bg-cyan-100 text-cyan-800', icon: '📶' },
    autre: { label: 'Autre', color: 'bg-gray-100 text-gray-800', icon: '🔧' },
  };

  const handleAddService = async (serviceData: any) => {
    try {
      await createServiceMutation.mutateAsync(serviceData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
    }
  };

  const handleEditService = async (serviceData: any) => {
    if (editingService) {
      try {
        await updateServiceMutation.mutateAsync({
          id: editingService.id,
          updates: serviceData
        });
        setEditingService(null);
      } catch (error) {
        console.error('Erreur lors de la modification du service:', error);
      }
    }
  };

  const handleDeleteService = async (service: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le service "${service.name}" ?`)) {
      try {
        await deleteServiceMutation.mutateAsync(service.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Services ({services.length})</h2>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service</h3>
            <p className="text-gray-500 mb-4">Commencez par ajouter votre premier service</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">{categories[service.category]?.icon || '🔧'}</span>
                    {service.name}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories[service.category]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {categories[service.category]?.label || service.category}
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
                  
                  {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  )}
                  
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
                      onClick={() => handleDeleteService(service)}
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
      )}

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

export default ServicesSection;
