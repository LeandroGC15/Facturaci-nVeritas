import React, { useState, useMemo } from 'react';
import { StockItem } from '@/types/stock';
import { InvoiceProduct, CartItem } from '@/types/invoice';
import { formatters } from '@/utils/formatters';
import { Loading } from '@/components/common/Loading/Loading';

interface ProductListProps {
  products: StockItem[];
  isLoading: boolean;
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onAddToCart,
  cartItems,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.id.toString().includes(query)
    );
  }, [products, searchQuery]);

  const handleProductClick = (product: StockItem) => {
    // Convertir StockItem a InvoiceProduct
    const invoiceProduct: InvoiceProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    const cartItem: CartItem = {
      product: invoiceProduct,
      quantity: 1,
      subtotal: product.price,
    };

    onAddToCart(cartItem);
  };

  const isProductInCart = (productId: number) => {
    return cartItems.some(item => item.product.id === productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading message="Cargando productos..." />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar producto por nombre, SKU o ID..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron productos</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
        const inCart = isProductInCart(product.id);
        const stockAvailable = product.stock > 0;

        return (
          <div
            key={product.id}
            onClick={() => stockAvailable && handleProductClick(product)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              !stockAvailable
                ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                : inCart
                ? 'bg-green-50 border-green-300 hover:bg-green-100'
                : 'bg-white border-gray-200 hover:border-primary-400 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                {product.sku && (
                  <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                )}
              </div>
              {inCart && (
                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  ✓
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <div>
                <p className="text-lg font-bold text-primary-600">
                  {formatters.currency(product.price)}
                </p>
                <p className={`text-sm ${stockAvailable ? 'text-gray-600' : 'text-red-600'}`}>
                  Stock: {product.stock}
                </p>
              </div>
              {!stockAvailable && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Sin stock
                </span>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

