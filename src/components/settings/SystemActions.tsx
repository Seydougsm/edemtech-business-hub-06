
import React from 'react';
import { Database, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemActions = () => {
  return (
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
  );
};

export default SystemActions;
