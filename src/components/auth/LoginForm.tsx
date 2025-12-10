import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/utils/validators';
import { useLogin } from '@/hooks/auth/useLogin';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      // Error manejado por el hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="tu@email.com"
      />
      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="••••••••"
      />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <Button type="submit" isLoading={isLoading} className="w-full">
        Iniciar Sesión
      </Button>
    </form>
  );
};

