import React, { useState, useEffect } from 'react';
import { useInvoice } from '@/hooks/invoice/useInvoice';
import { useStock } from '@/hooks/stock/useStock';
import { ProductList } from '@/components/invoice/ProductList';
import { InvoiceCart } from '@/components/invoice/InvoiceCart';
import { InvoiceTable } from '@/components/invoice/InvoiceTable';
import { InvoiceDetail } from '@/components/invoice/InvoiceDetail';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { CartItem, Invoice } from '@/types/invoice';

export const Invoices: React.FC = () => {
  const { invoices, isLoading, createInvoice, getInvoice, fetchInvoices } = useInvoice();
  const { items: products, isLoading: isLoadingProducts, fetchStock } = useStock();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showInvoicesList, setShowInvoicesList] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (showInvoicesList) {
      fetchInvoices();
    }
  }, [showInvoicesList]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddToCart = (item: CartItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.product.id === item.product.id);
    
    if (existingItem) {
      // Si ya existe, actualizar cantidad
      const newQuantity = existingItem.quantity + item.quantity;
      const maxQuantity = Math.min(newQuantity, item.product.stock);
      handleUpdateQuantity(item.product.id, maxQuantity);
    } else {
      // Si no existe, agregar nuevo item
      setCartItems([...cartItems, item]);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems(cartItems.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.min(quantity, item.product.stock);
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.product.price * newQuantity,
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };

  const handleCreateInvoice = async () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!window.confirm('¿Estás seguro de crear esta factura?')) {
      return;
    }

    setIsCreating(true);
    try {
      const request = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const newInvoice = await createInvoice(request);
      alert(`Factura #${newInvoice.id} creada exitosamente`);
      setCartItems([]);
      // Recargar productos para actualizar stock
      fetchStock();
      setShowInvoicesList(true);
      fetchInvoices();
    } catch (error: any) {
      alert(error.message || 'Error al crear la factura');
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const invoice = await getInvoice(id);
      setSelectedInvoice(invoice);
    } catch (error: any) {
      alert(error.message || 'Error al obtener la factura');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Facturación</h1>
        <div className="flex space-x-4 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowInvoicesList(!showInvoicesList)}
            className="flex-1 sm:flex-initial"
          >
            {showInvoicesList ? 'Nueva Factura' : 'Ver Facturas'}
          </Button>
        </div>
      </div>

      {showInvoicesList ? (
        <Card title="Facturas">
          <InvoiceTable
            invoices={invoices}
            onViewDetail={handleViewDetail}
            isLoading={isLoading}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card title="Productos Disponibles">
              <ProductList
                products={products}
                isLoading={isLoadingProducts}
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
              />
            </Card>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card title="Carrito de Compra" className="sticky top-4">
              <InvoiceCart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
              {cartItems.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleCreateInvoice}
                    isLoading={isCreating}
                    disabled={isCreating}
                    className="w-full"
                  >
                    Crear Factura
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <InvoiceDetail
              invoice={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

