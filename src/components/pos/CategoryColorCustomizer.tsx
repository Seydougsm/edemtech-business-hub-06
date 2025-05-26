
import React, { useState } from 'react';
import { Palette, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategoryColors } from '@/hooks/useCategoryColors';
import { toast } from 'sonner';

interface CategoryColorCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryColorCustomizer = ({ isOpen, onClose }: CategoryColorCustomizerProps) => {
  const { categories, updateCategoryColor, resetToDefaults } = useCategoryColors();
  const [tempColors, setTempColors] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.color }), {})
  );

  const colorOptions = [
    'bg-gray-100', 'bg-red-100', 'bg-orange-100', 'bg-amber-100', 'bg-yellow-100',
    'bg-lime-100', 'bg-green-100', 'bg-emerald-100', 'bg-teal-100', 'bg-cyan-100',
    'bg-sky-100', 'bg-blue-100', 'bg-indigo-100', 'bg-violet-100', 'bg-purple-100',
    'bg-fuchsia-100', 'bg-pink-100', 'bg-rose-100'
  ];

  const handleColorChange = (categoryId: string, color: string) => {
    setTempColors(prev => ({ ...prev, [categoryId]: color }));
  };

  const handleSave = () => {
    Object.entries(tempColors).forEach(([categoryId, color]) => {
      updateCategoryColor(categoryId, color);
    });
    toast.success('Couleurs des catégories mises à jour !');
    onClose();
  };

  const handleReset = () => {
    resetToDefaults();
    setTempColors(
      categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.color }), {})
    );
    toast.success('Couleurs remises par défaut !');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personnaliser les Couleurs des Catégories
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{category.name}</h3>
                  <div className={`px-3 py-1 rounded-full ${tempColors[category.id] || category.color}`}>
                    <span className="text-sm font-medium">Aperçu</span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(category.id, color)}
                      className={`w-8 h-8 rounded-full border-2 ${color} ${
                        tempColors[category.id] === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300 hover:scale-105'
                      } transition-all duration-200`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Remettre par défaut
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryColorCustomizer;
