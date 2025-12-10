import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '../../schemas/authSchemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { resetPassword, isResetPassword } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    resetPassword(data);
  };

  // Token inválido
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Token Inválido
          </h1>
          <p className="text-gray-600 mb-6">
            O link de recuperação está inválido ou expirou.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full">
              Solicitar Novo Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
      <div className="card max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔐 Nova Senha
          </h1>
          <p className="text-gray-600">
            Crie uma senha forte para sua conta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('newPassword')}
                type="password"
                placeholder="••••••••"
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-lg
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.newPassword ? 'border-error' : 'border-gray-300'}
                `}
              />
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-error">{errors.newPassword.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mínimo 8 caracteres, com maiúscula, minúscula e número
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isResetPassword}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Redefinir Senha
          </Button>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Atenção:</strong> Este link expira em 1 hora.
          </p>
        </div>
      </div>
    </div>
  );
};