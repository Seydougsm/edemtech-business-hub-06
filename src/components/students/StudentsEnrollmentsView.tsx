
import React, { useState } from 'react';
import { User, GraduationCap, Calendar, Euro, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStudentEnrollments } from '@/hooks/useStudentEnrollments';

const StudentsEnrollmentsView = () => {
  const { data: enrollments = [], isLoading } = useStudentEnrollments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.formation?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    active: 'Active',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  if (isLoading) {
    return <div className="p-6">Chargement des inscriptions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inscriptions des Élèves</h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de toutes les inscriptions aux formations
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{filteredEnrollments.length}</div>
          <div className="text-sm text-gray-500">inscription(s)</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom d'élève ou formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total inscriptions</p>
                <p className="text-lg font-semibold">{enrollments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Actives</p>
                <p className="text-lg font-semibold">
                  {enrollments.filter(e => e.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Terminées</p>
                <p className="text-lg font-semibold">
                  {enrollments.filter(e => e.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Revenus totaux</p>
                <p className="text-lg font-semibold">
                  {enrollments.reduce((sum, e) => sum + e.paid_amount, 0).toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des inscriptions */}
      <div className="space-y-4">
        {filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucune inscription trouvée</p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Effacer la recherche
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold text-lg">{enrollment.student?.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {enrollment.student?.email && (
                            <span>{enrollment.student.email}</span>
                          )}
                          {enrollment.student?.phone && (
                            <span>{enrollment.student.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="font-medium">{enrollment.formation?.title}</span>
                        <div className="text-sm text-gray-600">
                          Durée: {enrollment.formation?.duration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Inscrit le: {new Date(enrollment.enrollment_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[enrollment.status]}`}>
                      {statusLabels[enrollment.status]}
                    </span>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        Payé: {enrollment.paid_amount.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: {enrollment.total_amount.toLocaleString()} FCFA
                      </div>
                      
                      {enrollment.paid_amount < enrollment.total_amount && (
                        <div className="text-xs text-red-600 font-medium">
                          Reste: {(enrollment.total_amount - enrollment.paid_amount).toLocaleString()} FCFA
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(enrollment.paid_amount / enrollment.total_amount) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentsEnrollmentsView;
