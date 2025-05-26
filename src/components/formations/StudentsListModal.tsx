
import React from 'react';
import { X, User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEnrollmentsByFormation } from '@/hooks/useStudentEnrollments';
import { useFormations } from '@/hooks/useFormations';

interface StudentsListModalProps {
  formationId: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentsListModal: React.FC<StudentsListModalProps> = ({ formationId, isOpen, onClose }) => {
  const { data: enrollments = [], isLoading } = useEnrollmentsByFormation(formationId);
  const { data: formations = [] } = useFormations();

  if (!isOpen) return null;

  const formation = formations.find(f => f.id === formationId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-90vh overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Liste des Élèves</h2>
            <p className="text-gray-600">{formation?.title}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="text-center py-8">Chargement des inscriptions...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Aucun élève inscrit à cette formation</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {enrollments.length} élève(s) inscrit(s)
                </h3>
              </div>
              
              <div className="grid gap-4">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{enrollment.student?.name}</span>
                          </div>
                          
                          {enrollment.student?.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{enrollment.student.email}</span>
                            </div>
                          )}
                          
                          {enrollment.student?.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{enrollment.student.phone}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Inscrit le: {new Date(enrollment.enrollment_date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Payé: {enrollment.paid_amount.toLocaleString()} FCFA
                          </div>
                          <div className="text-sm text-gray-600">
                            Total: {enrollment.total_amount.toLocaleString()} FCFA
                          </div>
                          <div className="mt-1">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.paid_amount >= enrollment.total_amount 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {enrollment.paid_amount >= enrollment.total_amount ? 'Payé' : 'Partiellement payé'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-6">
          <Button onClick={onClose} className="w-full">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentsListModal;
