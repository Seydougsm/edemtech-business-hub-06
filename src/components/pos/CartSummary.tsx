
import React from 'react';
import { CreditCard, Trash2, Receipt, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  onDiscountChange: (discount: number) => void;
  onProcessPayment: () => void;
  onClearCart: () => void;
  onPrintReceipt: () => void;
  isEmpty: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  total,
  onDiscountChange,
  onProcessPayment,
  onClearCart,
  onPrintReceipt,
  isEmpty
}) => {
  const discountAmount = subtotal * (discount / 100);

  return (
    <div className="space-y-4">
      {!isEmpty && (
        <>
          {/* Discount Section */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <label className="text-sm font-medium text-blue-900">Remise (%):</label>
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => onDiscountChange(Number(e.target.value))}
              className="w-full"
              placeholder="0"
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total:</span>
              <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-600">Remise ({discount}%):</span>
                <span className="font-medium text-red-600">-{discountAmount.toLocaleString()} FCFA</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span className="text-gray-900">Total:</span>
              <span className="text-green-600">{total.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onProcessPayment} 
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              disabled={isEmpty}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Encaisser {total.toLocaleString()} FCFA
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={onClearCart}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Vider
              </Button>
              <Button 
                variant="outline"
                onClick={onPrintReceipt}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Receipt className="h-4 w-4 mr-1" />
                Reçu
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;
