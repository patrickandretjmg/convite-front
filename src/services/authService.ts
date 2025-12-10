import api from './api';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterData } from '../types';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data.data!;
  },

  // Register
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return data.data!;
  },

  // Verificar email
  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await api.get<ApiResponse>(`/auth/verify-email?token=${token}`);
    return { message: data.message || 'E-mail verificado com sucesso' };
  },

  // Reenviar verificação
  async resendVerification(email: string): Promise<{ message: string }> {
    const { data } = await api.post<ApiResponse>('/auth/resend-verification', { email });
    return { message: data.message || 'E-mail de verificação reenviado' };
  },

  // Solicitar recuperação de senha
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<ApiResponse>('/auth/forgot-password', { email });
    return { message: data.message || 'E-mail de recuperação enviado' };
  },

  // Redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.post<ApiResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    return { message: data.message || 'Senha redefinida com sucesso' };
  },

  // Buscar perfil
  async getProfile() {
    const { data } = await api.get<ApiResponse>('/auth/profile');
    return data.data;
  },
};