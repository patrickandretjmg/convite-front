import api from './api';
import type { ApiResponse, Event } from '../types';

interface CreateEventData {
  name: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  slug: string;
  confirmationDeadline?: string;
  idadeLimiteCriancaSemCodigo?: number | null;
}

interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
}

export interface EventStatistics {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  adults: number;
  children: number;
}

export const eventService = {
  // Criar evento
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const { data } = await api.post<ApiResponse<Event>>('/events', eventData);
    return data.data!;
  },

  // Listar eventos
  async getEvents(): Promise<Event[]> {
    const { data } = await api.get<ApiResponse<Event[]>>('/events');
    return data.data!;
  },

  // Buscar por ID
  async getEventById(id: string): Promise<Event> {
    const { data } = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return data.data!;
  },

  // Buscar por slug
  async getEventBySlug(slug: string): Promise<Event> {
    const { data } = await api.get<ApiResponse<Event>>(`/events/slug/${slug}`);
    return data.data!;
  },

  // Atualizar evento
  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    const { data } = await api.put<ApiResponse<Event>>(`/events/${id}`, eventData);
    return data.data!;
  },

  // Deletar evento
  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  // Cancelar evento
  async cancelEvent(id: string): Promise<Event> {
    const { data } = await api.patch<ApiResponse<Event>>(`/events/${id}/cancel`);
    return data.data!;
  },

  // Buscar estatísticas do evento
  async getEventStatistics(id: string): Promise<EventStatistics> {
    const { data } = await api.get<ApiResponse<EventStatistics>>(`/events/${id}/statistics`);
    return data.data!;
  },
};