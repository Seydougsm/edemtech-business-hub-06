
import React, { useState } from 'react';
import { Building, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CompanySettings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'EDEM TECH SOLUTION',
    address: 'Kara, 2ème vont à droite de la station CAP Tomdè, Togo',
    phone: '+228 98518686',
    email: 'contact@edemtechsolutions.com',
    website: 'www.edemtechsolutions.com',
    logo: '',
  });

  const handleSave = () => {
    alert('Informations de l\'entreprise sauvegardées avec succès !');
  };

  return (
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
        <Button onClick={handleSave} className="w-full">
          Sauvegarder les informations
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
