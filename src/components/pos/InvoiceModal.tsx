
import React from 'react';
import { X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: any;
}

const InvoiceModal = ({ isOpen, onClose, sale }: InvoiceModalProps) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR');
  const currentTime = new Date().toLocaleTimeString('fr-FR');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg print:hidden">
          <div className="flex items-center justify-between">
            <CardTitle>Facture</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-white hover:bg-blue-700"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="invoice-content">
            {/* En-tête de l'entreprise */}
            <div className="text-center mb-6 border-b-2 border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-blue-600">EDEM TECH SOLUTION</h1>
              <p className="text-gray-600">Kara, 2ème vont à droite</p>
              <p className="text-gray-600">Station CAP Tomdè, Togo</p>
              <p className="text-gray-600">Tél: +228 98518686</p>
            </div>

            {/* Informations de la facture */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">FACTURE</h3>
                <p className="text-sm text-gray-600">N°: {sale.sale_number}</p>
                <p className="text-sm text-gray-600">Date: {currentDate}</p>
                <p className="text-sm text-gray-600">Heure: {currentTime}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-800">CLIENT</h3>
                <p className="text-sm text-gray-600">
                  {sale.customer_name || 'Client anonyme'}
                </p>
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left">Article</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Qté</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">Prix Unit.</th>
                    <th className="border border-gray-300 px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-3 py-2">{item.name}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right">
                        {item.price.toLocaleString()} FCFA
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-1">
                  <span>Sous-total:</span>
                  <span>{sale.subtotal?.toLocaleString()} FCFA</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between py-1">
                    <span>Remise:</span>
                    <span>-{((sale.subtotal * sale.discount) / 100).toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                  <span>TOTAL:</span>
                  <span>{sale.total?.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>Merci pour votre confiance !</p>
              <p>Cette facture est générée automatiquement.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .invoice-content, .invoice-content * {
            visibility: visible;
          }
          .invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceModal;
