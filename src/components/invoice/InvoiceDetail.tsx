import React from 'react';
import { Invoice } from '@/types/invoice';
import { formatters } from '@/utils/formatters';
import { Button } from '@/components/common/Button/Button';

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onClose }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Pagada', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Factura #{invoice.id}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Creada el {formatters.dateTime(invoice.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {getStatusBadge(invoice.status)}
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-initial">
            Cerrar
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
        
        {/* Vista de tabla para desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Unitario
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatters.currency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatters.currency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista de cards para móviles */}
        <div className="md:hidden space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{item.productName}</h4>
                <span className="text-sm font-semibold text-primary-600">
                  {formatters.currency(item.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Cantidad: {item.quantity}</span>
                <span>{formatters.currency(item.unitPrice)} c/u</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg sm:text-xl font-semibold text-gray-900">Total:</span>
          <span className="text-2xl sm:text-3xl font-bold text-primary-600">
            {formatters.currency(invoice.total)}
          </span>
        </div>
      </div>
    </div>
  );
};

