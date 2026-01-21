import React, { useState, useEffect, useCallback } from 'react';
import { Supplier } from '@/types/supplier';
import { StockItem, StockListResponse } from '@/types/stock';
import { PurchaseItemRequest } from '@/types/purchase';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Input } from '@/components/common/Input/Input';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

// Extended PurchaseItem for display purposes
interface PurchaseItem extends PurchaseItemRequest {
  productName: string;
  subtotal: number;
}

interface PurchaseModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplierId: number, invoiceNumber: string, items: PurchaseItemRequest[]) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  supplier,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(0);

  // Custom hook to fetch products
  const [products, setProducts] = useState<StockItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const url = `${endpoints.stock.list}?page=1&limit=100`;
      const data = await apiClient.get<StockListResponse>(url);
      setProducts(data.products || []);
    } catch (err: any) {
      setProductsError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter out products that are already in the items list
  const availableProducts = products.filter(product =>
    !items.some(item => item.productId === product.id)
  );

  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber('');
      setItems([]);
      setSelectedProduct(null);
      setQuantity(1);
      setUnitCost(0);
      setShowNewProductForm(false);
      setNewProductName('');
      setNewProductSku('');
      setNewProductPrice(0);
    }
  }, [isOpen]);

  const addExistingProduct = () => {
    if (!selectedProduct || quantity <= 0 || unitCost <= 0) return;

    const subtotal = quantity * unitCost;
    const newItem: PurchaseItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      unitCost,
      subtotal,
    };

    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity(1);
    setUnitCost(0);
  };

  const addNewProduct = () => {
    if (!newProductName.trim() || quantity <= 0 || unitCost <= 0) return;

    // For new products, we'll use a negative ID to indicate it's new
    // The backend will need to handle creating the product first
    const tempId = -Date.now(); // Temporary negative ID
    const subtotal = quantity * unitCost;
    const newItem: PurchaseItem = {
      productId: tempId,
      productName: newProductName,
      quantity,
      unitCost,
      subtotal,
    };

    setItems([...items, newItem]);
    setNewProductName('');
    setNewProductSku('');
    setNewProductPrice(0);
    setShowNewProductForm(false);
    setQuantity(1);
    setUnitCost(0);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async () => {
    if (items.length === 0 || !invoiceNumber.trim()) return;

    // Convert items to the format expected by the API
    const purchaseItems: PurchaseItemRequest[] = items.map(item => {
      const baseItem: PurchaseItemRequest = {
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      };

      // If it's a new product (negative ID), include creation data
      if (item.productId < 0 && 'productName' in item) {
        return {
          ...baseItem,
          productName: item.productName,
          productSku: `SKU-${Date.now()}`, // Generate SKU
          productPrice: item.unitCost * 1.5, // Default markup
        };
      }

      return baseItem;
    });

    await onSubmit(supplier.id, invoiceNumber, purchaseItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Comprar a {supplier.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Invoice Number */}
            <div>
              <Input
                label="Número de Factura"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Ej: FAC-PROV-2024-001"
              />
            </div>

            {/* Add Product Section */}
            <Card>
              <h4 className="text-md font-medium mb-4">Agregar Producto</h4>

              {/* Toggle between existing and new product */}
              <div className="mb-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewProductForm(false)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      !showNewProductForm
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    Producto Existente
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewProductForm(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      showNewProductForm
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    Nuevo Producto
                  </button>
                </div>
              </div>

              {!showNewProductForm ? (
                /* Existing Product Form */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producto Existente
                    </label>
                    {productsLoading ? (
                      <div className="text-sm text-gray-500">Cargando productos...</div>
                    ) : productsError ? (
                      <div className="text-sm text-red-500">Error al cargar productos</div>
                    ) : (
                      <select
                        value={selectedProduct?.id || ''}
                        onChange={(e) => {
                          const product = availableProducts.find(p => p.id === parseInt(e.target.value));
                          setSelectedProduct(product || null);
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Seleccionar producto</option>
                        {availableProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} {product.sku && `(${product.sku})`} - Stock: {product.stock}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Cantidad"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Input
                      label="Costo Unitario"
                      type="number"
                      step="0.01"
                      value={unitCost}
                      onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addExistingProduct} disabled={!selectedProduct}>
                      Agregar
                    </Button>
                  </div>
                </div>
              ) : (
                /* New Product Form */
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Input
                      label="Nombre del Producto"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="Ej: Producto Nuevo"
                    />
                  </div>
                  <div>
                    <Input
                      label="SKU (opcional)"
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <Input
                      label="Precio Venta"
                      type="number"
                      step="0.01"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div>
                    <Input
                      label="Cantidad"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Input
                      label="Costo Unitario"
                      type="number"
                      step="0.01"
                      value={unitCost}
                      onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="flex items-end col-span-5">
                    <Button onClick={addNewProduct} disabled={!newProductName.trim()}>
                      Agregar Nuevo Producto
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Items List */}
            {items.length > 0 && (
              <Card>
                <h4 className="text-md font-medium mb-4">Productos a Comprar</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Producto
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Cantidad
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Costo Unitario
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Subtotal
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.productName}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">${item.unitCost.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">${item.subtotal.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <strong>Total: ${getTotal().toFixed(2)}</strong>
                </div>
              </Card>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={loading}
                disabled={items.length === 0 || !invoiceNumber.trim()}
              >
                Crear Compra
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};