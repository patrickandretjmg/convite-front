import api from './api';
import type { ApiResponse, Event, GuestWithEvent } from '../types';

export const publicService = {
  // Buscar evento público por slug
  async getEventBySlug(slug: string): Promise<Event> {
    const { data } = await api.get<ApiResponse<Event>>(`/public/events/${slug}`);
    return data.data!;
  },

  // Buscar convidado por código (retorna GuestWithEvent)
  async getGuestByCode(code: string): Promise<GuestWithEvent> {
    const { data } = await api.get<ApiResponse<GuestWithEvent>>(`/public/guest/${code}`);
    return data.data!;
  },

  // Confirmar presença (retorna GuestWithEvent)
  async confirmPresence(code: string): Promise<GuestWithEvent> {
    const { data } = await api.post<ApiResponse<GuestWithEvent>>('/public/confirm', { code });
    return data.data!;
  },

  // Recusar convite (retorna GuestWithEvent)
  async declinePresence(code: string): Promise<GuestWithEvent> {
    const { data } = await api.post<ApiResponse<GuestWithEvent>>('/public/decline', { code });
    return data.data!;
  },

  // Gerar QR Code
  async getQRCode(code: string): Promise<{ qrCode: string }> {
    const { data } = await api.get<ApiResponse<{ qrCode: string }>>(`/public/qrcode/${code}`);
    return data.data!;
  },
};