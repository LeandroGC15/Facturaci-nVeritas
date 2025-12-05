import React from 'react';
import { CartItem } from '@/types/invoice';
import { formatters } from '@/utils/formatters';
import { Button } from '@/components/common/Button/Button';

interface InvoiceCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export const InvoiceCart: React.FC<InvoiceCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>El carrito está vacío</p>
        <p className="text-sm mt-2">Busca productos para agregarlos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.product.name}</div>
                {item.product.sku && (
                  <div className="text-sm text-gray-500">SKU: {item.product.sku}</div>
                )}
                <div className="text-sm text-gray-600">
                  Stock disponible: {item.product.stock}
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onRemoveItem(item.product.id)}
              >
                Eliminar
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3">
                <label className="text-sm text-gray-700">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    const clampedQuantity = Math.min(Math.max(1, newQuantity), item.product.stock);
                    onUpdateQuantity(item.product.id, clampedQuantity);
                  }}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span className="text-sm text-gray-500">
                  de {item.product.stock} disponibles
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {formatters.currency(item.product.price)} x {item.quantity}
                </div>
                <div className="font-medium text-gray-900">
                  {formatters.currency(item.subtotal)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatters.currency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

