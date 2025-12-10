import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - adicionar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    
    // Token expirado ou inválido - mas só redireciona se tiver token
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      
      // Só redireciona se tinha token (usuário estava autenticado)
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Extrair mensagem de erro do backend
    const message = error.response?.data?.message || error.message || 'Erro desconhecido';
    
    // Criar erro com mensagem amigável
    const customError = new Error(message);
    return Promise.reject(customError);
  }
);


export default api;
