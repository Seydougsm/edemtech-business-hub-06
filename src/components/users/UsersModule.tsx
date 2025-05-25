
import React, { useState } from 'react';
import { Plus, Shield, User, Edit, Trash2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'secretary' | 'user';
  permissions: string[];
  lastLogin: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const UsersModule = () => {
  const [selectedRole, setSelectedRole] = useState('all');

  const users: User[] = [
    {
      id: '1',
      name: 'Administrateur EDEM',
      email: 'admin@edemtechsolutions.com',
      role: 'admin',
      permissions: ['all'],
      lastLogin: '2024-01-15 14:30',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Marie Gestionnaire',
      email: 'marie.manager@edemtechsolutions.com',
      role: 'manager',
      permissions: ['pos', 'services', 'billing', 'statistics'],
      lastLogin: '2024-01-15 10:15',
      status: 'active',
      createdAt: '2024-01-05'
    },
    {
      id: '3',
      name: 'Ama Secrétaire',
      email: 'ama.secretary@edemtechsolutions.com',
      role: 'secretary',
      permissions: ['pos', 'billing'],
      lastLogin: '2024-01-15 08:45',
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: '4',
      name: 'Koffi Assistant',
      email: 'koffi.user@edemtechsolutions.com',
      role: 'user',
      permissions: ['pos'],
      lastLogin: '2024-01-14 16:20',
      status: 'inactive',
      createdAt: '2024-01-12'
    },
  ];

  const roles = {
    admin: { label: 'Administrateur', color: 'bg-red-100 text-red-800' },
    manager: { label: 'Gestionnaire', color: 'bg-blue-100 text-blue-800' },
    secretary: { label: 'Secrétaire', color: 'bg-green-100 text-green-800' },
    user: { label: 'Utilisateur', color: 'bg-gray-100 text-gray-800' },
  };

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(user => user.role === selectedRole);

  const activeUsers = users.filter(user => user.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">Administration des comptes et permissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Key className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connexions Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres par rôle */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRole === 'all' ? "default" : "outline"}
          onClick={() => setSelectedRole('all')}
          size="sm"
        >
          Tous les Rôles
        </Button>
        {Object.entries(roles).map(([role, config]) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            onClick={() => setSelectedRole(role)}
            size="sm"
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Liste des Utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Dernière Connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roles[user.role].color}`}>
                      {roles[user.role].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes('all') ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          Tous droits
                        </span>
                      ) : (
                        user.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {permission}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.lastLogin).toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Key className="h-4 w-4" />
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

      {/* Section permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { module: 'POS', description: 'Accès au point de vente' },
              { module: 'Services', description: 'Gestion des services et produits' },
              { module: 'Facturation', description: 'Création et gestion des factures' },
              { module: 'Comptabilité', description: 'Accès aux données financières' },
              { module: 'Statistiques', description: 'Consultation des rapports' },
              { module: 'Utilisateurs', description: 'Gestion des comptes utilisateurs' },
            ].map((perm, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900">{perm.module}</h4>
                <p className="text-sm text-gray-600 mt-1">{perm.description}</p>
                <div className="mt-3 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Lecture</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Écriture</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Admin</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersModule;
