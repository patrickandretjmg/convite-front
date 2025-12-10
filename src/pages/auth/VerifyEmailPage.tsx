import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const hasVerified = useRef(false);
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    if (!token || hasVerified.current) {
      if (!token) setError(true);
      setIsLoading(false);
      return;
    }

    const verifyEmail = async () => {
      hasVerified.current = true;
      setIsLoading(true);

      try {
        await authService.verifyEmail(token);
        
        if (user) {
          setUser({ ...user, isEmailVerified: true });
        }
        
        setSuccess(true);
        toast.success('E-mail verificado com sucesso! ✅');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        console.error('Erro ao verificar e-mail:', err);
        setError(true);
        toast.error('Token inválido ou já utilizado');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate, setUser, user]);

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
        <div className="card max-w-md w-full text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">
            Verificando E-mail...
          </h1>
          <p className="text-gray-600">
            Aguarde enquanto verificamos seu e-mail.
          </p>
        </div>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
        <div className="card max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">
            E-mail Verificado! ✅
          </h1>
          <p className="text-gray-600 mb-6">
            Sua conta foi ativada com sucesso. Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  // Error
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4">
      <div className="card max-w-md w-full text-center">
        <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">
          Token Inválido
        </h1>
        <p className="text-gray-600 mb-6">
          O link de verificação está inválido, expirado ou já foi utilizado.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" className="w-full">
            Ir para Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};