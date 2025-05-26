
import React, { useState } from 'react';
import { Plus, Users, Calendar, Edit, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormations, useCreateFormation, useUpdateFormation, useDeleteFormation } from '@/hooks/useFormations';
import { useEnrollmentsByFormation } from '@/hooks/useStudentEnrollments';
import FormationForm from './FormationForm';
import StudentsListModal from './StudentsListModal';
import EnrollStudentModal from './EnrollStudentModal';

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

const FormationsModule = () => {
  const { data: formations = [], isLoading } = useFormations();
  const createFormationMutation = useCreateFormation();
  const updateFormationMutation = useUpdateFormation();
  const deleteFormationMutation = useDeleteFormation();

  const [showFormationForm, setShowFormationForm] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [showStudentsList, setShowStudentsList] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

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

  const handleAddFormation = async (formationData: Omit<Formation, 'id' | 'current_participants'>) => {
    try {
      await createFormationMutation.mutateAsync(formationData);
      setShowFormationForm(false);
    } catch (error) {
      console.error('Error creating formation:', error);
    }
  };

  const handleEditFormation = async (formationData: Omit<Formation, 'id' | 'current_participants'>) => {
    if (editingFormation) {
      try {
        await updateFormationMutation.mutateAsync({
          id: editingFormation.id,
          updates: formationData
        });
        setEditingFormation(null);
      } catch (error) {
        console.error('Error updating formation:', error);
      }
    }
  };

  const handleDeleteFormation = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await deleteFormationMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting formation:', error);
      }
    }
  };

  const handleViewStudents = (formationId: string) => {
    setSelectedFormationId(formationId);
    setShowStudentsList(true);
  };

  const handleEnrollStudent = (formationId: string) => {
    setSelectedFormationId(formationId);
    setShowEnrollModal(true);
  };

  if (isLoading) {
    return <div className="p-6">Chargement des formations...</div>;
  }

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
                    {formation.current_participants}/{formation.max_participants} participants
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(formation.current_participants / formation.max_participants) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Début: {new Date(formation.start_date).toLocaleDateString('fr-FR')}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewStudents(formation.id)}
                    className="flex-1"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Voir élèves
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEnrollStudent(formation.id)}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Inscrire
                  </Button>
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

      {showStudentsList && selectedFormationId && (
        <StudentsListModal
          formationId={selectedFormationId}
          isOpen={showStudentsList}
          onClose={() => setShowStudentsList(false)}
        />
      )}

      {showEnrollModal && selectedFormationId && (
        <EnrollStudentModal
          formationId={selectedFormationId}
          isOpen={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </div>
  );
};

export default FormationsModule;
