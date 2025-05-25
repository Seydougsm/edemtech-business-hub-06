
import React from 'react';
import CompanySettings from './CompanySettings';
import SystemSettings from './SystemSettings';
import CustomizationSettings from './CustomizationSettings';
import SystemActions from './SystemActions';

const SettingsModule = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Configuration de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanySettings />
        <SystemSettings />
      </div>

      <CustomizationSettings />
      <SystemActions />
    </div>
  );
};

export default SettingsModule;
