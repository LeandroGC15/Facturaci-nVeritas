import React, { useState } from 'react';
import { CreateUserRequest } from '@/types/auth';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Input } from '@/components/common/Input/Input';

interface UserFormProps {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    name: '',
    role: 'user',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserRequest, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserRequest, string>> = {};

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email válido es requerido';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 [UserForm] handleSubmit llamado');
    
    if (validate()) {
      console.log('✅ [UserForm] Validación exitosa, enviando datos:', {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        passwordLength: formData.password.length,
      });
      
      try {
        await onSubmit(formData);
        console.log('✅ [UserForm] Usuario creado exitosamente, limpiando formulario');
        // Limpiar formulario después de enviar exitosamente
        setFormData({
          email: '',
          password: '',
          name: '',
          role: 'user',
        });
        setErrors({});
      } catch (error) {
        console.error('❌ [UserForm] Error en onSubmit:', error);
      }
    } else {
      console.log('❌ [UserForm] Validación fallida:', errors);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as CreateUserRequest['role'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">Usuario</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          )}
          <Button type="submit" isLoading={isLoading}>
            Crear Usuario
          </Button>
        </div>
      </form>
    </Card>
  );
};

