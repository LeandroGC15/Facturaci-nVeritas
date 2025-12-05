import React, { useState } from 'react';
import { useUsers } from '@/hooks/users/useUsers';
import { UserForm } from '@/components/users/UserForm';
import { CreateUserRequest } from '@/types/auth';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';

export const Users: React.FC = () => {
  const { createUser, isLoading, error } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateUser = async (data: CreateUserRequest) => {
    console.log('🔵 [Users] handleCreateUser llamado con datos:', {
      email: data.email,
      name: data.name,
      role: data.role,
    });
    
    try {
      const createdUser = await createUser(data);
      console.log('✅ [Users] Usuario creado exitosamente:', createdUser);
      
      setSuccessMessage(`Usuario ${data.email} creado exitosamente`);
      setShowForm(false);
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('❌ [Users] Error en handleCreateUser:', err);
      console.error('❌ [Users] Error completo:', {
        message: err.message,
        stack: err.stack,
      });
      // El error ya se maneja en el hook y se muestra en el estado
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            Crear Nuevo Usuario
          </Button>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm ? (
        <div>
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <Card>
          <p className="text-gray-600">
            Desde aquí puedes crear nuevos usuarios para el sistema de facturación.
            Haz clic en "Crear Nuevo Usuario" para comenzar.
          </p>
        </Card>
      )}
    </div>
  );
};

