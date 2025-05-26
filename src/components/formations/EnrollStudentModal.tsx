
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudents, useCreateStudent } from '@/hooks/useStudents';
import { useCreateStudentEnrollment } from '@/hooks/useStudentEnrollments';
import { useFormations } from '@/hooks/useFormations';
import { toast } from 'sonner';

interface EnrollStudentModalProps {
  formationId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({ formationId, isOpen, onClose }) => {
  const { data: students = [] } = useStudents();
  const { data: formations = [] } = useFormations();
  const createStudentMutation = useCreateStudent();
  const createEnrollmentMutation = useCreateStudentEnrollment();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [enrollmentData, setEnrollmentData] = useState({
    paid_amount: 0
  });

  if (!isOpen) return null;

  const formation = formations.find(f => f.id === formationId);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) {
      toast.error('Le nom de l\'étudiant est requis');
      return;
    }

    try {
      const student = await createStudentMutation.mutateAsync(newStudent);
      setSelectedStudentId(student.id);
      setShowNewStudentForm(false);
      setNewStudent({ name: '', email: '', phone: '' });
      toast.success('Étudiant créé avec succès !');
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !formation) {
      toast.error('Veuillez sélectionner un étudiant');
      return;
    }

    try {
      await createEnrollmentMutation.mutateAsync({
        student_id: selectedStudentId,
        formation_id: formationId,
        total_amount: formation.price,
        paid_amount: enrollmentData.paid_amount
      });
      
      onClose();
      setSelectedStudentId('');
      setEnrollmentData({ paid_amount: 0 });
    } catch (error) {
      console.error('Error enrolling student:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-90vh overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Inscrire un Élève</h2>
            <p className="text-gray-600">{formation?.title}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sélection de l'étudiant */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Sélectionner un étudiant</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewStudentForm(!showNewStudentForm)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Nouvel étudiant
              </Button>
            </div>
            
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Choisir un étudiant...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.email && `(${student.email})`}
                </option>
              ))}
            </select>
          </div>

          {/* Formulaire nouveau étudiant */}
          {showNewStudentForm && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Créer un nouvel étudiant</h3>
              <form onSubmit={handleCreateStudent} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nom complet *"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optionnel)"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Téléphone (optionnel)"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <Button type="submit" size="sm" className="w-full">
                  Créer l'étudiant
                </Button>
              </form>
            </div>
          )}

          {/* Informations de l'inscription */}
          {formation && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Informations de l'inscription</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Formation:</span> {formation.title}
                  </div>
                  <div>
                    <span className="font-medium">Prix total:</span> {formation.price.toLocaleString()} FCFA
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant payé à l'inscription (FCFA)
                  </label>
                  <input
                    type="number"
                    value={enrollmentData.paid_amount}
                    onChange={(e) => setEnrollmentData({ ...enrollmentData, paid_amount: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    max={formation.price}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-6">
          <form onSubmit={handleEnrollStudent}>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Inscrire l'élève
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollStudentModal;
