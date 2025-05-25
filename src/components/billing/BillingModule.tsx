
import React, { useState } from 'react';
import { Plus, FileText, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  total: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}

interface InvoiceItem {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const BillingModule = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      customerName: 'Jean Dupont',
      customerPhone: '+228 90123456',
      items: [
        { id: '1', serviceName: 'Photocopie N&B A4', quantity: 20, unitPrice: 25, total: 500 },
        { id: '2', serviceName: 'Impression couleur A4', quantity: 5, unitPrice: 150, total: 750 },
      ],
      total: 1250,
      date: '2024-01-15',
      status: 'paid'
    },
    {
      id: '2',
      number: 'INV-002',
      customerName: 'Marie Kouassi',
      customerPhone: '+228 91234567',
      items: [
        { id: '1', serviceName: 'Formation Informatique', quantity: 1, unitPrice: 50000, total: 50000 },
      ],
      total: 50000,
      date: '2024-01-16',
      status: 'pending'
    }
  ]);

  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    paid: 'Payée',
    pending: 'En attente',
    overdue: 'En retard'
  };

  const InvoiceForm = () => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
      { serviceName: '', quantity: 1, unitPrice: 0 }
    ]);

    const services = [
      { name: 'Photocopie N&B A4', price: 25 },
      { name: 'Photocopie Couleur A4', price: 100 },
      { name: 'Impression couleur A4', price: 150 },
      { name: 'Saisie de document', price: 200 },
      { name: 'Ticket Wifi 1h', price: 200 },
    ];

    const addItem = () => {
      setItems([...items, { serviceName: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof Omit<InvoiceItem, 'id' | 'total'>, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Auto-fill price when service is selected
      if (field === 'serviceName') {
        const service = services.find(s => s.name === value);
        if (service) {
          newItems[index].unitPrice = service.price;
        }
      }
      
      setItems(newItems);
    };

    const calculateTotal = () => {
      return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const invoiceItems: InvoiceItem[] = items.map((item, index) => ({
        id: index.toString(),
        ...item,
        total: item.quantity * item.unitPrice
      }));

      const newInvoice: Invoice = {
        id: Date.now().toString(),
        number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
        customerName,
        customerPhone,
        items: invoiceItems,
        total: calculateTotal(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      setInvoices([...invoices, newInvoice]);
      setShowInvoiceForm(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Créer une facture</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom du client</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone (optionnel)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium">Articles/Services</h4>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                  <div className="col-span-5">
                    <select
                      value={item.serviceName}
                      onChange={(e) => updateItem(index, 'serviceName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Sélectionner un service</option>
                      {services.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Prix unitaire"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="py-2 px-3 bg-gray-100 rounded-md text-right">
                      {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="text-right">
                <span className="text-lg font-bold">
                  Total: {calculateTotal().toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Créer la facture
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowInvoiceForm(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const InvoicePreview = ({ invoice }: { invoice: Invoice }) => {
    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="print:block">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-blue-900">EDEM TECH SOLUTION</h1>
              <p className="text-sm text-gray-600">Kara, 2ème vont à droite de la station CAP Tomdè, Togo</p>
              <p className="text-sm text-gray-600">Tél: +228 98518686 | Email: contact@edemtechsolutions.com</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">FACTURE</h2>
                  <p className="text-sm">N° {invoice.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Date: {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Facturé à:</h3>
              <p>{invoice.customerName}</p>
              {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
            </div>

            <table className="w-full mb-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Service/Produit</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Qté</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Prix unitaire</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-2">{item.serviceName}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{item.unitPrice.toLocaleString()} FCFA</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{item.total.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">TOTAL:</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{invoice.total.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>

            <div className="text-center text-sm text-gray-600">
              <p>Merci de votre confiance!</p>
            </div>
          </div>

          <div className="flex space-x-3 mt-6 print:hidden">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
          <p className="text-gray-600 mt-2">Gérez vos factures et devis</p>
        </div>
        <Button onClick={() => setShowInvoiceForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle facture</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{invoice.number}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                  {statusLabels[invoice.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{invoice.customerName}</p>
                  <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {invoice.total.toLocaleString()} FCFA
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInvoice(invoice)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showInvoiceForm && <InvoiceForm />}
      {selectedInvoice && <InvoicePreview invoice={selectedInvoice} />}
    </div>
  );
};

export default BillingModule;
