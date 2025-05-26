
import React from 'react';
import { Database, Settings, Trash2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SystemActions = () => {
  const handleBackupData = async () => {
    try {
      const { data: products } = await supabase.from('products').select('*');
      const { data: sales } = await supabase.from('sales').select('*');
      const { data: expenses } = await supabase.from('expenses').select('*');
      const { data: config } = await supabase.from('system_config').select('*');

      const backupData = {
        timestamp: new Date().toISOString(),
        products,
        sales,
        expenses,
        config
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edemgesco-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Sauvegarde créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des données');
    }
  };

  const handleRestoreSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Ici vous pourriez implémenter la logique de restauration
        // Pour l'instant, on affiche juste un message
        toast.success('Fichier de sauvegarde chargé. Fonctionnalité de restauration à implémenter.');
      } catch (error) {
        toast.error('Erreur lors de la lecture du fichier de sauvegarde');
      }
    };
    input.click();
  };

  const handleResetApplication = () => {
    if (confirm('⚠️ ATTENTION: Cette action va supprimer TOUTES les données de l\'application. Cette action est irréversible. Êtes-vous sûr de vouloir continuer?')) {
      if (confirm('Dernière confirmation: Voulez-vous vraiment réinitialiser l\'application et perdre toutes les données?')) {
        // Ici vous pourriez implémenter la logique de réinitialisation
        toast.error('Fonctionnalité de réinitialisation désactivée pour la sécurité. Contactez l\'administrateur.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Système</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={handleBackupData}
          >
            <Download className="h-8 w-8 text-green-600" />
            <span>Sauvegarder les Données</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={handleRestoreSettings}
          >
            <Upload className="h-8 w-8 text-blue-600" />
            <span>Restaurer les Données</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 hover:bg-red-50"
            onClick={handleResetApplication}
          >
            <Trash2 className="h-8 w-8" />
            <span>Réinitialiser l'Application</span>
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> La sauvegarde télécharge un fichier JSON avec toutes vos données. 
            Conservez ce fichier en lieu sûr pour pouvoir restaurer vos données si nécessaire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemActions;
