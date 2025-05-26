
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Formation {
  id: string;
  title: string;
  description?: string;
  duration: string;
  price: number;
  max_participants: number;
  current_participants: number;
  start_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface FormationFormProps {
  formation?: Formation;
  onSubmit: (formation: Omit<Formation, 'id' | 'current_participants'>) => void;
  onCancel: () => void;
}

const FormationForm: React.FC<FormationFormProps> = ({ formation, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: formation?.title || '',
    description: formation?.description || '',
    duration: formation?.duration || '',
    price: formation?.price || 0,
    max_participants: formation?.max_participants || 10,
    start_date: formation?.start_date || '',
    status: formation?.status || 'upcoming' as const,
  });

  const statusLabels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    completed: 'Terminée'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-90vh overflow-y-auto">
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
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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

export default FormationForm;
