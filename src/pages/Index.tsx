
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import ServicesManagement from '@/components/services/ServicesManagement';
import BillingModule from '@/components/billing/BillingModule';
import FormationsModule from '@/components/formations/FormationsModule';
import POSModule from '@/components/pos/POSModule';
import AccountingModule from '@/components/accounting/AccountingModule';
import StatisticsModule from '@/components/statistics/StatisticsModule';
import StudentsModule from '@/components/students/StudentsModule';
import ExpensesModule from '@/components/expenses/ExpensesModule';
import InventoryModule from '@/components/inventory/InventoryModule';
import InventoryReportModule from '@/components/inventory/InventoryReportModule';
import UsersModule from '@/components/users/UsersModule';
import SettingsModule from '@/components/settings/SettingsModule';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POSModule />;
      case 'services':
        return <ServicesManagement />;
      case 'billing':
      case 'printing':
        return <BillingModule />;
      case 'formations':
        return <FormationsModule />;
      case 'accounting':
        return <AccountingModule />;
      case 'statistics':
        return <StatisticsModule />;
      case 'students':
        return <StudentsModule />;
      case 'expenses':
        return <ExpensesModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'inventory-report':
        return <InventoryReportModule />;
      case 'users':
        return <UsersModule />;
      case 'settings':
        return <SettingsModule />;
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
