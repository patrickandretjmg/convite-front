import api from './api';
import type { 
  ApiResponse, 
  CheckInByCodeResponse, 
  CheckInStats,
  Guest,
  ChildCompanion 
} from '../types';

interface CheckInListResponse {
  guests: Guest[];
  stats: CheckInStats;
}

export const checkInService = {
  async checkInByCode(code: string): Promise<CheckInByCodeResponse> {
    const { data } = await api.post<CheckInByCodeResponse>('/check-in/code', { code });
    return data;
  },

  async searchGuestByName(eventId: string, name: string): Promise<Guest[]> {
    const { data } = await api.get<ApiResponse<Guest[]>>(
      `/check-in/events/${eventId}/guests/search`,
      { params: { name } }
    );
    return data.data || [];
  },

  async searchChildByName(eventId: string, name: string): Promise<ChildCompanion[]> {
    const { data } = await api.get<ApiResponse<ChildCompanion[]>>(
      `/check-in/events/${eventId}/children/search`,
      { params: { name } }
    );
    return data.data || [];
  },

  async checkInChild(childId: string): Promise<{ message: string }> {
    const { data } = await api.post<ApiResponse>(`/check-in/children/${childId}`);
    return { message: data.message || 'Check-in realizado com sucesso' };
  },

  async getEventStats(eventId: string): Promise<CheckInStats> {
    const { data } = await api.get<ApiResponse<CheckInStats>>(
      `/check-in/events/${eventId}/stats`
    );
    return data.data!;
  },

  async getCheckInList(eventId: string): Promise<CheckInListResponse> {
    const { data } = await api.get<ApiResponse<CheckInListResponse>>(
      `/check-in/events/${eventId}/list`
    );
    return data.data!;
  },

  async getAllGuests(eventId: string): Promise<Guest[]> {
    const { data } = await api.get<ApiResponse<Guest[]>>(
      `/guests?eventId=${eventId}`
    );
    return data.data || [];
  },
};

