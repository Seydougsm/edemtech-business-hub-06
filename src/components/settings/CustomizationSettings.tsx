
import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomizationSettings = () => {
  const handleSave = () => {
    alert('Personnalisation appliquée avec succès !');
  };

  return (
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
          <Button onClick={handleSave}>
            Appliquer la personnalisation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationSettings;
