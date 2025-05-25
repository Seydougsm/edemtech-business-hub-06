
import React, { useState } from 'react';
import { Plus, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const FormationsModule = () => {
  const [formations, setFormations] = useState<Formation[]>([
    {
      id: '1',
      title: 'Initiation à l\'informatique',
      description: 'Formation de base pour découvrir l\'informatique',
      duration: '40h',
      price: 50000,
      maxParticipants: 15,
      currentParticipants: 8,
      startDate: '2024-02-01',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Électricité et Réseaux télécoms',
      description: 'Formation technique en électricité et télécommunications',
      duration: '60h',
      price: 75000,
      maxParticipants: 12,
      currentParticipants: 12,
      startDate: '2024-01-15',
      status: 'ongoing'
    },
    {
      id: '3',
      title: 'Graphisme et montage vidéo',
      description: 'Apprenez les bases du design graphique et du montage vidéo',
      duration: '50h',
      price: 65000,
      maxParticipants: 10,
      currentParticipants: 6,
      startDate: '2024-02-15',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Orientation des antennes paraboliques',
      description: 'Formation spécialisée en installation d\'antennes satellites',
      duration: '30h',
      price: 40000,
      maxParticipants: 8,
      currentParticipants: 4,
      startDate: '2024-03-01',
      status: 'upcoming'
    }
  ]);

  const [showFormationForm, setShowFormationForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    completed: 'Terminée'
  };

  const FormationForm = ({ formation, onSubmit, onCancel }: {
    formation?: Formation;
    onSubmit: (formation: Omit<Formation, 'id' | 'currentParticipants'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: formation?.title || '',
      description: formation?.description || '',
      duration: formation?.duration || '',
      price: formation?.price || 0,
      maxParticipants: formation?.maxParticipants || 10,
      startDate: formation?.startDate || '',
      status: formation?.status || 'upcoming',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData as Omit<Formation, 'id' | 'currentParticipants'>);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">
            {formation ? 'Modifier la formation' : 'Ajouter une formation'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre de la formation</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Durée</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="ex: 40h"
                  required
                />
              </div>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Participants max</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Formation['status'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                {formation ? 'Modifier' : 'Ajouter'}
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

  const handleAddFormation = (formationData: Omit<Formation, 'id' | 'currentParticipants'>) => {
    const newFormation = { 
      ...formationData, 
      id: Date.now().toString(),
      currentParticipants: 0
    };
    setFormations([...formations, newFormation]);
    setShowFormationForm(false);
  };

  const handleEditFormation = (formationData: Omit<Formation, 'id' | 'currentParticipants'>) => {
    if (editingFormation) {
      setFormations(formations.map(f => 
        f.id === editingFormation.id 
          ? { ...formationData, id: editingFormation.id, currentParticipants: editingFormation.currentParticipants }
          : f
      ));
      setEditingFormation(null);
    }
  };

  const handleDeleteFormation = (id: string) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="text-gray-600 mt-2">Gérez vos formations et programmes d'apprentissage</p>
        </div>
        <Button onClick={() => setShowFormationForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle formation</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formations.map((formation) => (
          <Card key={formation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{formation.title}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[formation.status]}`}>
                  {statusLabels[formation.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">{formation.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Durée:</span> {formation.duration}
                  </div>
                  <div>
                    <span className="font-medium">Prix:</span> {formation.price.toLocaleString()} FCFA
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {formation.currentParticipants}/{formation.maxParticipants} participants
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(formation.currentParticipants / formation.maxParticipants) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Début: {new Date(formation.startDate).toLocaleDateString('fr-FR')}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFormation(formation)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFormation(formation.id)}
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

      {showFormationForm && (
        <FormationForm
          onSubmit={handleAddFormation}
          onCancel={() => setShowFormationForm(false)}
        />
      )}

      {editingFormation && (
        <FormationForm
          formation={editingFormation}
          onSubmit={handleEditFormation}
          onCancel={() => setEditingFormation(null)}
        />
      )}
    </div>
  );
};

export default FormationsModule;
