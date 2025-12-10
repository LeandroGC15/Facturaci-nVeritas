import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/stock',
    label: 'Stock',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    path: '/invoices',
    label: 'Facturaciiiión',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    path: '/users',
    label: 'Usuarios',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    adminOnly: true,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter((item) => {
    // Si el item requiere admin y el usuario no es admin, no mostrarlo
    if (item.adminOnly) {
      // Verificar que el usuario existe y tiene rol admin
      if (!user || user.role !== 'admin') {
        return false;
      }
    }
    return true;
  });

  const handleLinkClick = () => {
    // Cerrar sidebar en móviles al hacer click en un link
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar Desktop - siempre visible en lg+ */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <div className="w-64 bg-gray-800 min-h-screen fixed lg:static inset-y-0 left-0 z-50">
          <nav className="mt-8">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-white transition-colors ${
                    isActive
                      ? 'bg-primary-600 border-r-4 border-primary-400'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Sidebar Mobile - drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Menú</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-4">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-6 py-3 text-white transition-colors ${
                  isActive
                    ? 'bg-primary-600 border-r-4 border-primary-400'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

