
import React from 'react';
import { 
  Home, 
  Package, 
  FileText, 
  BarChart3, 
  GraduationCap, 
  Settings, 
  Users,
  Printer,
  Calculator,
  ShoppingCart,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, currentPage, onPageChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'pos', label: 'Point de Vente', icon: ShoppingCart },
    { id: 'services', label: 'Services & Produits', icon: Package },
    { id: 'billing', label: 'Facturation', icon: FileText },
    { id: 'printing', label: 'Impression/Copie', icon: Printer },
    { id: 'accounting', label: 'Comptabilité', icon: Calculator },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'inventory-report', label: 'Inventaire', icon: Archive },
    { id: 'formations', label: 'Formations', icon: GraduationCap },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-gray-900 text-white transition-all duration-300 flex flex-col",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/2dd06bf5-eff9-4719-b07a-4f68803e8b05.png" 
              alt="EDEM TECH SOLUTIONS Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          {isOpen && (
            <div>
              <h1 className="font-bold text-lg">EDEM TECH</h1>
              <p className="text-xs text-gray-400">SOLUTION</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    currentPage === item.id 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {isOpen && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <p>Kara, 2ème vont à droite</p>
            <p>Station CAP Tomdè, Togo</p>
            <p>+228 98518686</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
