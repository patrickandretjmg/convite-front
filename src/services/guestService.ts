import api from './api';
import type { ApiResponse, Guest } from '../types';

interface CreateGuestData {
  name: string;
  email?: string;
  phone?: string;
  eventId: string;
}

interface UpdateGuestData {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'DECLINED';
}

export const guestService = {
  // Criar convidado
  async createGuest(guestData: CreateGuestData): Promise<Guest> {
    const { data } = await api.post<ApiResponse<Guest>>('/guests', guestData);
    return data.data!;
  },

  // Listar convidados do evento
  async getGuestsByEvent(eventId: string): Promise<Guest[]> {
    const { data } = await api.get<ApiResponse<Guest[]>>(`/guests?eventId=${eventId}`);
    return data.data!;
  },

  // Buscar por ID
  async getGuestById(id: string): Promise<Guest> {
    const { data } = await api.get<ApiResponse<Guest>>(`/guests/${id}`);
    return data.data!;
  },

  // Buscar por código
  async getGuestByCode(code: string): Promise<Guest> {
    const { data } = await api.get<ApiResponse<Guest>>(`/guests/code/${code}`);
    return data.data!;
  },

  // Atualizar convidado
  async updateGuest(id: string, guestData: UpdateGuestData): Promise<Guest> {
    const { data } = await api.put<ApiResponse<Guest>>(`/guests/${id}`, guestData);
    return data.data!;
  },

  // Deletar convidado
  async deleteGuest(id: string): Promise<void> {
    await api.delete(`/guests/${id}`);
  },

  // Adicionar acompanhante
  async addCompanion(guestCode: string, companionCode: string): Promise<Guest> {
    const { data } = await api.post<ApiResponse<Guest>>('/guests/companion/add', {
      guestCode,
      companionCode,
    });
    return data.data!;
  },

  // Remover acompanhante
  async removeCompanion(guestCode: string): Promise<Guest> {
    const { data } = await api.post<ApiResponse<Guest>>('/guests/companion/remove', {
      code: guestCode,
    });
    return data.data!;
  },

  // Check-in
  async checkIn(code: string): Promise<Guest> {
    const { data } = await api.post<ApiResponse<Guest>>('/guests/checkin', { code });
    return data.data!;
  },
};