import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { useEventStore } from '../stores/eventStore';

export const useEventDetails = (id: string) => {
  const { setCurrentEvent } = useEventStore();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const data = await eventService.getEventById(id);
      setCurrentEvent(data);
      return data;
    },
    enabled: !!id,
  });

  return {
    event,
    isLoading,
    error,
  };
};