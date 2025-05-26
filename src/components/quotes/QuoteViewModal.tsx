
import React from 'react';
import { X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
}

const QuoteViewModal = ({ isOpen, onClose, quote }: QuoteViewModalProps) => {
  if (!isOpen || !quote) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-green-600 text-white rounded-t-lg print:hidden">
          <div className="flex items-center justify-between">
            <CardTitle>Devis</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="text-white hover:bg-green-700"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-green-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 print:p-4">
          <div className="quote-content print:block">
            {/* En-tête de l'entreprise avec logo */}
            <div className="text-center mb-6 border-b-2 border-gray-200 pb-4 print:mb-4 print:pb-2">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/lovable-uploads/080c3c8a-2ed6-40a8-b7fa-95adf5a701e7.png" 
                  alt="EDEM TECH SOLUTIONS" 
                  className="h-16 w-auto print:h-12"
                />
              </div>
              <h1 className="text-2xl font-bold text-green-600 print:text-black print:text-xl">EDEM TECH SOLUTIONS</h1>
              <p className="text-gray-600 print:text-black print:text-sm">Kara, 2ème von à droite</p>
              <p className="text-gray-600 print:text-black print:text-sm">Station CAP Tomdè, Togo</p>
              <p className="text-gray-600 print:text-black print:text-sm">Tél: +228 98518686</p>
            </div>

            {/* Informations du devis */}
            <div className="grid grid-cols-2 gap-4 mb-6 print:mb-4 print:gap-2">
              <div>
                <h3 className="font-semibold text-gray-800 print:text-black print:text-sm">DEVIS</h3>
                <p className="text-sm text-gray-600 print:text-black print:text-xs">N°: {quote.quote_number}</p>
                <p className="text-sm text-gray-600 print:text-black print:text-xs">Date: {currentDate}</p>
                <p className="text-sm text-gray-600 print:text-black print:text-xs">
                  Valide jusqu'au: {new Date(quote.valid_until).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-800 print:text-black print:text-sm">CLIENT</h3>
                <p className="text-sm text-gray-600 print:text-black print:text-xs">
                  {quote.customer_name || 'Client anonyme'}
                </p>
                {quote.customer_phone && (
                  <p className="text-sm text-gray-600 print:text-black print:text-xs">
                    Tél: {quote.customer_phone}
                  </p>
                )}
                {quote.customer_email && (
                  <p className="text-sm text-gray-600 print:text-black print:text-xs">
                    Email: {quote.customer_email}
                  </p>
                )}
              </div>
            </div>

            {/* Tableau des articles */}
            <div className="mb-6 print:mb-4">
              <table className="w-full border-collapse border border-gray-300 print:border-black">
                <thead>
                  <tr className="bg-gray-100 print:bg-white">
                    <th className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-left print:text-xs">Article</th>
                    <th className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-center print:text-xs">Qté</th>
                    <th className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-right print:text-xs">Prix Unit.</th>
                    <th className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-right print:text-xs">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 print:text-xs">{item.name}</td>
                      <td className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-center print:text-xs">{item.quantity}</td>
                      <td className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-right print:text-xs">
                        {item.price.toLocaleString()} FCFA
                      </td>
                      <td className="border border-gray-300 print:border-black px-3 py-2 print:px-1 print:py-1 text-right print:text-xs">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end mb-6 print:mb-4">
              <div className="w-64 print:w-48">
                <div className="flex justify-between py-1 print:text-xs">
                  <span>Sous-total:</span>
                  <span>{quote.subtotal?.toLocaleString()} FCFA</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between py-1 print:text-xs">
                    <span>Remise:</span>
                    <span>-{((quote.subtotal * quote.discount) / 100).toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-300 print:border-black font-bold text-lg print:text-sm">
                  <span>TOTAL:</span>
                  <span>{quote.total?.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Pied de page */}
            <div className="text-center text-sm text-gray-600 print:text-black print:text-xs border-t pt-4 print:pt-2">
              <p>Ce devis est valable jusqu'au {new Date(quote.valid_until).toLocaleDateString('fr-FR')}</p>
              <p>Merci pour votre confiance !</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteViewModal;
