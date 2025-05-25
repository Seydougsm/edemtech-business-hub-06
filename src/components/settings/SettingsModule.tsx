
import React, { useState } from 'react';
import { Settings, Building, MapPin, Phone, Mail, Palette, Database, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const SettingsModule = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'EDEM TECH SOLUTION',
    address: 'Kara, 2ème vont à droite de la station CAP Tomdè, Togo',
    phone: '+228 98518686',
    email: 'contact@edemtechsolutions.com',
    website: 'www.edemtechsolutions.com',
    logo: '',
  });

  const [systemSettings, setSystemSettings] = useState({
    currency: 'FCFA',
    language: 'fr',
    timezone: 'Africa/Lome',
    dateFormat: 'dd/mm/yyyy',
    taxRate: 18,
    autoBackup: true,
    notifications: true,
  });

  const handleSave = (section: string) => {
    alert(`Paramètres ${section} sauvegardés avec succès !`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Configuration de l'application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de l'entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de l'Entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise
              </label>
              <Input
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Adresse
              </label>
              <textarea
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Téléphone
                </label>
                <Input
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <Input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Web
              </label>
              <Input
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
              />
            </div>
            <Button onClick={() => handleSave('entreprise')} className="w-full">
              Sauvegarder les informations
            </Button>
          </CardContent>
        </Card>

        {/* Paramètres système */}
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
            <Button onClick={() => handleSave('système')} className="w-full">
              Sauvegarder les paramètres
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Personnalisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personnalisation de l'Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Thème</h4>
              <div className="space-y-2">
                {['Clair', 'Sombre', 'Automatique'].map((theme) => (
                  <label key={theme} className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value={theme}
                      className="mr-2"
                      defaultChecked={theme === 'Clair'}
                    />
                    {theme}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Couleur Principale</h4>
              <div className="grid grid-cols-4 gap-2">
                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Disposition</h4>
              <div className="space-y-2">
                {['Sidebar fixe', 'Sidebar rétractable', 'Navigation top'].map((layout) => (
                  <label key={layout} className="flex items-center">
                    <input
                      type="radio"
                      name="layout"
                      value={layout}
                      className="mr-2"
                      defaultChecked={layout === 'Sidebar rétractable'}
                    />
                    {layout}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={() => handleSave('personnalisation')}>
              Appliquer la personnalisation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions système */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Database className="h-8 w-8" />
              <span>Sauvegarder les Données</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Settings className="h-8 w-8" />
              <span>Restaurer les Paramètres</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 text-red-600">
              <Trash2 className="h-8 w-8" />
              <span>Réinitialiser l'Application</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModule;
