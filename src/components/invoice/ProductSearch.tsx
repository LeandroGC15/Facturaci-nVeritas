import React, { useState, useEffect, useRef } from 'react';
import { useInvoiceProducts } from '@/hooks/invoice/useInvoiceProducts';
import { InvoiceProduct, CartItem } from '@/types/invoice';
import { Loading } from '@/components/common/Loading/Loading';
import { formatters } from '@/utils/formatters';

interface ProductSearchProps {
  onAddToCart: (item: CartItem) => void;
  cartItems: CartItem[];
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onAddToCart, cartItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { products, isLoading, error, searchProducts } = useInvoiceProducts();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (product: InvoiceProduct) => {
    const cartItem: CartItem = {
      product,
      quantity: 1,
      subtotal: product.price,
    };
    onAddToCart(cartItem);
    setSearchQuery('');
    setShowResults(false);
  };

  const isProductInCart = (productId: number) => {
    return cartItems.some(item => item.product.id === productId);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, SKU o ID del producto..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loading message="" />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}

      {showResults && products.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {products.map((product) => {
            const inCart = isProductInCart(product.id);
            const stockAvailable = product.stock > 0;

            return (
              <div
                key={product.id}
                onClick={() => stockAvailable && !inCart && handleProductClick(product)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  !stockAvailable || inCart
                    ? 'bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.sku && (
                      <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      ID: {product.id} | Stock: {product.stock} | Precio: {formatters.currency(product.price)}
                    </div>
                  </div>
                  <div className="ml-4">
                    {inCart && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        En carrito
                      </span>
                    )}
                    {!stockAvailable && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Sin stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showResults && searchQuery && !isLoading && products.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No se encontraron productos
        </div>
      )}
    </div>
  );
};

