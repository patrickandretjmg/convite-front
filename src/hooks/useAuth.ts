import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, logout, user } = useAuthStore();

  // Login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Login realizado com sucesso! 🎉');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fazer login');
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Conta criada com sucesso! Verifique seu e-mail. 📧');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar conta');
    },
  });

  // Logout
  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  // Verificar email
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Token inválido ou expirado');
    },
  });

  // Reenviar verificação
  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      const message = error.message || 'Erro ao reenviar verificação';
      
      if (message.includes('já verificado') || message.includes('already verified')) {
        toast.error('Seu e-mail já está verificado! ✅');
      } else {
        toast.error(message);
      }
    },
  });

  // Solicitar recuperação
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao solicitar recuperação');
    },
  });

  // Redefinir senha
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao redefinir senha');
    },
  });

  // Buscar perfil
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    enabled: !!useAuthStore.getState().token,
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    verifyEmail: verifyEmailMutation.mutate,
    resendVerification: resendVerificationMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    profile,
    isLoadingProfile,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,
    isForgotPassword: forgotPasswordMutation.isPending,
    isResetPassword: resetPasswordMutation.isPending,
    currentUser: user,
  };
};