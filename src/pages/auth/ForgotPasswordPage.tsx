import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../../schemas/authSchemas';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage = () => {
  const { forgotPassword, isForgotPassword } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
      <div className="card max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            🔑 Recuperar Senha
          </h1>
          <p className="text-gray-600">
            Enviaremos um link de recuperação para seu e-mail
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="seu@email.com"
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

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isForgotPassword}
          >
            Enviar Link de Recuperação
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Verifique sua caixa de spam se não receber o e-mail em alguns minutos.
          </p>
        </div>
      </div>
    </div>
  );
};