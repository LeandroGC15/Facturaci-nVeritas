import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card } from '@/components/common/Card/Card';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <Card title="Iniciar Sesión" className="shadow-xl">
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">Veritas</h1>
            <p className="text-sm sm:text-base text-gray-600">Sistema de Facturación</p>
          </div>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

