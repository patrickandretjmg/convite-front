import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Erro ao fazer login com Google');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      
      const userData = searchParams.get('user');
      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          setAuth(user, token);
          toast.success('Login realizado com sucesso!');
          navigate('/dashboard');
        } catch (error) {
          console.error('Erro ao processar dados do usuário:', error);
          toast.error('Erro ao processar login');
          navigate('/login');
        }
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error('Token não encontrado');
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-secondary-light flex items-center justify-center">
      <div className="card max-w-md w-full text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">
          Processando login...
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto validamos suas credenciais
        </p>
      </div>
    </div>
  );
};
