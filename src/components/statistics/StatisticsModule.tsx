
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

const StatisticsModule = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('revenue');

  const monthlyData = [
    { name: 'Jan', revenus: 125000, depenses: 45000, photocopies: 450, formations: 12 },
    { name: 'Fév', revenus: 142000, depenses: 52000, photocopies: 520, formations: 15 },
    { name: 'Mar', revenus: 138000, depenses: 48000, photocopies: 480, formations: 18 },
    { name: 'Avr', revenus: 156000, depenses: 55000, photocopies: 580, formations: 22 },
    { name: 'Mai', revenus: 167000, depenses: 58000, photocopies: 620, formations: 25 },
    { name: 'Jun', revenus: 189000, depenses: 62000, photocopies: 710, formations: 28 },
  ];

  const serviceDistribution = [
    { name: 'Photocopies', value: 45, color: '#3B82F6', amount: 85000 },
    { name: 'Formations', value: 25, color: '#10B981', amount: 70000 },
    { name: 'Impressions', value: 20, color: '#F59E0B', amount: 25000 },
    { name: 'WiFi', value: 10, color: '#EF4444', amount: 9000 },
  ];

  const dailyActivity = [
    { time: '08h', ventes: 12 },
    { time: '09h', ventes: 25 },
    { time: '10h', ventes: 45 },
    { time: '11h', ventes: 38 },
    { time: '12h', ventes: 22 },
    { time: '13h', ventes: 15 },
    { time: '14h', ventes: 35 },
    { time: '15h', ventes: 52 },
    { time: '16h', ventes: 48 },
    { time: '17h', ventes: 35 },
    { time: '18h', ventes: 18 },
  ];

  const getChartData = () => {
    switch (chartType) {
      case 'revenue':
        return monthlyData;
      case 'services':
        return serviceDistribution;
      case 'activity':
        return dailyActivity;
      default:
        return monthlyData;
    }
  };

  const renderChart = () => {
    if (chartType === 'revenue') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, '']} />
            <Area type="monotone" dataKey="revenus" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            <Area type="monotone" dataKey="depenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'services') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={serviceDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent, amount }) => `${name}: ${(percent * 100).toFixed(0)}% (${amount.toLocaleString()} FCFA)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {serviceDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${props.payload.amount.toLocaleString()} FCFA`, name]} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'activity') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailyActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ventes" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques Avancées</h1>
          <p className="text-gray-600 mt-2">Analyses détaillées et tendances</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              size="sm"
            >
              {range === 'day' ? 'Jour' : 
               range === 'week' ? 'Semaine' :
               range === 'month' ? 'Mois' : 'Année'}
            </Button>
          ))}
        </div>
      </div>

      {/* Types de graphiques */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={chartType === 'revenue' ? "default" : "outline"}
          onClick={() => setChartType('revenue')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Revenus vs Dépenses
        </Button>
        <Button
          variant={chartType === 'services' ? "default" : "outline"}
          onClick={() => setChartType('services')}
          className="flex items-center gap-2"
        >
          <PieChartIcon className="h-4 w-4" />
          Répartition Services
        </Button>
        <Button
          variant={chartType === 'activity' ? "default" : "outline"}
          onClick={() => setChartType('activity')}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Activité Quotidienne
        </Button>
      </div>

      {/* Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle>
            {chartType === 'revenue' && 'Évolution des Revenus et Dépenses'}
            {chartType === 'services' && 'Répartition par Service'}
            {chartType === 'activity' && 'Activité par Heure'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Performance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Meilleur mois:</span>
                <span className="font-bold text-green-600">Juin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Croissance:</span>
                <span className="font-bold text-green-600">+18.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Moyenne:</span>
                <span className="font-bold">152,500 FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Services Populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Top 1:</span>
                <span className="font-bold text-blue-600">Photocopies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Top 2:</span>
                <span className="font-bold text-green-600">Formations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Émergent:</span>
                <span className="font-bold text-orange-600">WiFi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Heures de Pointe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Peak:</span>
                <span className="font-bold text-red-600">15h-16h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Calme:</span>
                <span className="font-bold text-yellow-600">13h-14h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Moyenne/h:</span>
                <span className="font-bold">32 ventes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Prévisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Juillet:</span>
                <span className="font-bold text-green-600">195,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Trimestre:</span>
                <span className="font-bold text-blue-600">580,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tendance:</span>
                <span className="font-bold text-green-600">↗ Positive</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsModule;
