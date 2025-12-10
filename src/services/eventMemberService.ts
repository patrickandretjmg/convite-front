import api from './api';
import type { ApiResponse, EventMember, EventMemberRole } from '../types';

export const eventMemberService = {
  async getEventMembers(eventId: string): Promise<EventMember[]> {
    const { data } = await api.get<ApiResponse<EventMember[]>>(`/event-members/events/${eventId}`);
    return data.data || [];
  },

  async addEventMember(
    eventId: string, 
    userEmail: string, 
    role: EventMemberRole
  ): Promise<EventMember> {
    const { data } = await api.post<ApiResponse<EventMember>>(
      `/event-members`,
      { eventId, userEmail, role }
    );
    return data.data!;
  },

  async updateEventMemberRole(
    eventId: string, 
    memberId: string, 
    role: EventMemberRole
  ): Promise<EventMember> {
    const { data } = await api.patch<ApiResponse<EventMember>>(
      `/event-members/${memberId}`,
      { role }
    );
    return data.data!;
  },

  async removeEventMember(eventId: string, memberId: string): Promise<void> {
    await api.delete(`/event-members/${memberId}`);
  },
};
