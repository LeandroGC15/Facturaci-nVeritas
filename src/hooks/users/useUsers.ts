import { useState } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { CreateUserRequest, User } from '@/types/auth';

export const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (data: CreateUserRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    console.log('🔵 [useUsers] Iniciando creación de usuario:', {
      email: data.email,
      name: data.name,
      role: data.role,
      passwordLength: data.password.length,
    });
    
    try {
      console.log('📤 [useUsers] Enviando petición POST a:', endpoints.users.create);
      console.log('📤 [useUsers] Datos enviados:', { ...data, password: '***' });
      
      const response = await apiClient.post<{ user: User }>(endpoints.users.create, data);
      
      console.log('✅ [useUsers] Usuario creado exitosamente:', response.user);
      return response.user;
    } catch (err: any) {
      console.error('❌ [useUsers] Error al crear usuario:', err);
      console.error('❌ [useUsers] Error completo:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear usuario';
      console.error('❌ [useUsers] Mensaje de error:', errorMessage);
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 [useUsers] Finalizando creación de usuario');
    }
  };

  return {
    createUser,
    isLoading,
    error,
  };
};

