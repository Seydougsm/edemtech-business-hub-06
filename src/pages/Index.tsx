
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import ServicesManagement from '@/components/services/ServicesManagement';
import BillingModule from '@/components/billing/BillingModule';
import FormationsModule from '@/components/formations/FormationsModule';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServicesManagement />;
      case 'billing':
      case 'printing':
        return <BillingModule />;
      case 'formations':
        return <FormationsModule />;
      case 'accounting':
      case 'statistics':
        return <Dashboard />;
      case 'users':
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentPage === 'users' ? 'Gestion des Utilisateurs' : 'Paramètres'}
            </h1>
            <p className="text-gray-600 mt-2">
              {currentPage === 'users' 
                ? 'Module en développement - Gestion des utilisateurs et des droits d\'accès'
                : 'Module en développement - Configuration de l\'application'
              }
            </p>
            <div className="mt-8 p-8 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-800">Cette fonctionnalité sera disponible dans une prochaine version.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
