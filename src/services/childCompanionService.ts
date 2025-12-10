import api from './api';
import type { 
  AddChildCompanionRequest, 
  AddChildCompanionResponse, 
  ChildCompanion, 
  ApiResponse 
} from '../types';

export const childCompanionService = {
  addChildCompanion: async (data: AddChildCompanionRequest): Promise<AddChildCompanionResponse> => {
    const response = await api.post<AddChildCompanionResponse>(
      '/public/child-companion/add',
      data
    );
    return response.data;
  },

  getGuestChildren: async (guestCode: string): Promise<ChildCompanion[]> => {
    const response = await api.get<ApiResponse<ChildCompanion[]>>(
      `/public/child-companions/guest/${guestCode}`
    );
    return response.data.data || [];
  },

  getEventChildren: async (eventId: string): Promise<ChildCompanion[]> => {
    const response = await api.get<ApiResponse<ChildCompanion[]>>(
      `/child-companions/event/${eventId}`
    );
    return response.data.data || [];
  },

  removeChildCompanion: async (childId: string): Promise<void> => {
    await api.delete(`/public/child-companion/${childId}`);
  },
};
