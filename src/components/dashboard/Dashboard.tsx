
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './StatCard';
import { DollarSign, FileText, Users, TrendingUp, Printer, Wifi } from 'lucide-react';

const Dashboard = () => {
  // Données simulées
  const salesData = [
    { name: 'Jan', value: 125000 },
    { name: 'Fév', value: 142000 },
    { name: 'Mar', value: 138000 },
    { name: 'Avr', value: 156000 },
    { name: 'Mai', value: 167000 },
    { name: 'Jun', value: 189000 },
  ];

  const serviceData = [
    { name: 'Photocopies', value: 45, color: '#3B82F6' },
    { name: 'Saisie', value: 25, color: '#10B981' },
    { name: 'Impressions', value: 20, color: '#F59E0B' },
    { name: 'Formations', value: 10, color: '#EF4444' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre entreprise</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chiffre d'affaires"
          value="189 000 FCFA"
          icon={DollarSign}
          change="+12.5%"
          changeType="positive"
          color="green"
        />
        <StatCard
          title="Factures émises"
          value="67"
          icon={FileText}
          change="+8.2%"
          changeType="positive"
          color="blue"
        />
        <StatCard
          title="Services rendus"
          value="234"
          icon={Printer}
          change="+15.3%"
          changeType="positive"
          color="orange"
        />
        <StatCard
          title="Formations actives"
          value="12"
          icon={Users}
          change="+2"
          changeType="positive"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des ventes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des ventes (FCFA)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} FCFA`, 'Ventes']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des services */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des services (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
        <div className="space-y-4">
          {[
            { action: 'Facture #INV-001 émise', client: 'Jean Dupont', amount: '15 000 FCFA', time: 'Il y a 2h' },
            { action: 'Formation Informatique', client: 'Marie Kouassi', amount: '50 000 FCFA', time: 'Il y a 4h' },
            { action: 'Photocopies couleur', client: 'Koffi Mensah', amount: '8 500 FCFA', time: 'Il y a 6h' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.client}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{activity.amount}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
