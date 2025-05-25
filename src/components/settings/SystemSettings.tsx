
import React, { useState } from 'react';
import { Settings, Database, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const SystemSettings = () => {
  const [systemSettings, setSystemSettings] = useState({
    currency: 'FCFA',
    language: 'fr',
    timezone: 'Africa/Lome',
    dateFormat: 'dd/mm/yyyy',
    taxRate: 18,
    autoBackup: true,
    notifications: true,
  });

  const handleSave = () => {
    alert('Paramètres système sauvegardés avec succès !');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres Système
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise
            </label>
            <select
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="FCFA">FCFA</option>
              <option value="EUR">Euro</option>
              <option value="USD">Dollar US</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Langue
            </label>
            <select
              value={systemSettings.language}
              onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ewe">Ewe</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuseau Horaire
          </label>
          <select
            value={systemSettings.timezone}
            onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Africa/Lome">Africa/Lomé</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taux de TVA (%)
          </label>
          <Input
            type="number"
            value={systemSettings.taxRate}
            onChange={(e) => setSystemSettings({...systemSettings, taxRate: Number(e.target.value)})}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              <Database className="inline h-4 w-4 mr-1" />
              Sauvegarde automatique
            </span>
            <button
              onClick={() => setSystemSettings({...systemSettings, autoBackup: !systemSettings.autoBackup})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                systemSettings.autoBackup ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              <Bell className="inline h-4 w-4 mr-1" />
              Notifications
            </span>
            <button
              onClick={() => setSystemSettings({...systemSettings, notifications: !systemSettings.notifications})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                systemSettings.notifications ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  systemSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Sauvegarder les paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
