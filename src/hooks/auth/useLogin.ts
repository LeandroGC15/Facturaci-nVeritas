import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginRequest } from '@/types/auth';

export const useLogin = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(credentials);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: handleLogin,
    isLoading,
    error,
  };
};

