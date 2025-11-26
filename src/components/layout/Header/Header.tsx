import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">Veritas</h1>
            {tenant && (
              <span className="ml-4 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {tenant.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-700">
                {user.name} ({user.email})
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

