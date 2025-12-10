import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, User, Mail, Phone } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { createGuestSchema, updateGuestSchema, type CreateGuestInput, type UpdateGuestInput } from '../../schemas/guestSchemas';
import { Button } from '../ui/Button';
import type { Guest } from '../../types';

interface GuestFormModalProps {
  eventId: string;
  guest?: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGuestInput | UpdateGuestInput) => void;
  isLoading: boolean;
}

export const GuestFormModal = ({
  eventId,
  guest,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: GuestFormModalProps) => {
  const isEditing = !!guest;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateGuestInput | UpdateGuestInput>({
    resolver: zodResolver(isEditing ? updateGuestSchema : createGuestSchema),
    defaultValues: guest ? {
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
    } : {
      eventId,
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleFormSubmit = (data: CreateGuestInput | UpdateGuestInput) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">
            {isEditing ? 'Editar Convidado' : 'Adicionar Convidado'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('name')}
                type="text"
                placeholder="Ex: Maria Silva"
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.name ? 'border-error' : 'border-gray-300'}
                `}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail (opcional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="maria@exemplo.com"
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.email ? 'border-error' : 'border-gray-300'}
                `}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* ✅ Telefone com Máscara (react-imask) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone/WhatsApp (opcional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <IMaskInput
                    {...field}
                    mask="(00) 00000-0000"
                    placeholder="(11) 99999-9999"
                    onAccept={(value) => field.onChange(value)}
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg
                      focus:ring-2 focus:ring-primary focus:border-transparent
                      ${errors.phone ? 'border-error' : 'border-gray-300'}
                    `}
                  />
                )}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
            )}
          </div>

          {/* Info */}
          {!isEditing && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Um código único será gerado automaticamente para este convidado.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isLoading}
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar Convidado'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};