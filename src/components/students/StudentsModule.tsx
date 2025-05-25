
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, GraduationCap, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  formation: string;
  totalAmount: number;
  paidAmount: number;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'suspended';
}

const StudentsModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const students: Student[] = [
    {
      id: '1',
      name: 'Jean Kouassi',
      email: 'jean.kouassi@email.com',
      phone: '+228 90123456',
      formation: 'Initiation Informatique',
      totalAmount: 50000,
      paidAmount: 30000,
      enrollmentDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Marie Attiogbe',
      email: 'marie.attiogbe@email.com',
      phone: '+228 91234567',
      formation: 'Graphisme et Montage',
      totalAmount: 75000,
      paidAmount: 75000,
      enrollmentDate: '2024-01-10',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Koffi Mensah',
      email: 'koffi.mensah@email.com',
      phone: '+228 92345678',
      formation: 'Électricité et Réseaux',
      totalAmount: 60000,
      paidAmount: 20000,
      enrollmentDate: '2024-01-20',
      status: 'active'
    },
    {
      id: '4',
      name: 'Ama Agbeko',
      email: 'ama.agbeko@email.com',
      phone: '+228 93456789',
      formation: 'Orientation Antennes',
      totalAmount: 40000,
      paidAmount: 40000,
      enrollmentDate: '2024-01-05',
      status: 'completed'
    },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.formation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminé';
      case 'suspended': return 'Suspendu';
      default: return 'Inconnu';
    }
  };

  const getRemainingAmount = (student: Student) => {
    return student.totalAmount - student.paidAmount;
  };

  const getPaymentProgress = (student: Student) => {
    return (student.paidAmount / student.totalAmount) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Élèves</h1>
          <p className="text-gray-600 mt-2">Suivi des formations et paiements</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel Élève
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Élèves</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Formation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diplômés</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'completed').length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente Paiement</p>
                <p className="text-2xl font-bold text-orange-600">
                  {students.filter(s => getRemainingAmount(s) > 0).length}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un élève ou une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'En cours' },
            { value: 'completed', label: 'Terminés' },
            { value: 'suspended', label: 'Suspendus' }
          ].map((status) => (
            <Button
              key={status.value}
              variant={selectedStatus === status.value ? "default" : "outline"}
              onClick={() => setSelectedStatus(status.value)}
              size="sm"
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Liste des élèves */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Élèves ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Reste à Payer</TableHead>
                <TableHead>Date Inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.formation}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{student.paidAmount.toLocaleString()} FCFA</span>
                        <span>{getPaymentProgress(student).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${getPaymentProgress(student)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${getRemainingAmount(student) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {getRemainingAmount(student).toLocaleString()} FCFA
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(student.enrollmentDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsModule;
