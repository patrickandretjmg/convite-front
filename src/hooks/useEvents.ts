import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { eventService } from '../services/eventService';
import { useEventStore } from '../stores/eventStore';
import { toISODateTime, datetimeLocalToISO } from '../utils/dateHelpers';

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

export const useEvents = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setEvents, addEvent, updateEvent: updateEventStore, deleteEvent: deleteEventStore } = useEventStore();

  // Listar eventos
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const data = await eventService.getEvents();
      setEvents(data);
      return data;
    },
  });

  // Criar evento
  const createEventMutation = useMutation({
    mutationFn: (eventData: CreateEventData) => {
      // Converter data e hora para ISO datetime
      const payload = {
        ...eventData,
        date: toISODateTime(eventData.date, eventData.time),
        confirmationDeadline: eventData.confirmationDeadline 
          ? datetimeLocalToISO(eventData.confirmationDeadline)
          : undefined,
      };
      
      return eventService.createEvent(payload);
    },
    onSuccess: (data) => {
      addEvent(data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Evento criado com sucesso! 🎉');
      navigate(`/events/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar evento');
    },
  });

  // Atualizar evento
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) => {
      // Converter data e hora para ISO datetime se fornecidos
      const payload: UpdateEventData = { ...data };
      
      if (data.date && data.time) {
        payload.date = toISODateTime(data.date, data.time);
      }
      
      if (data.confirmationDeadline) {
        payload.confirmationDeadline = datetimeLocalToISO(data.confirmationDeadline);
      }
      
      return eventService.updateEvent(id, payload);
    },
    onSuccess: (data) => {
      updateEventStore(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      toast.success('Evento atualizado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar evento');
    },
  });

  // Deletar evento
  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: (_, id) => {
      deleteEventStore(id);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Evento deletado com sucesso! 🗑️');
      navigate('/events');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar evento');
    },
  });

  // Cancelar evento
  const cancelEventMutation = useMutation({
    mutationFn: (id: string) => eventService.cancelEvent(id),
    onSuccess: (data) => {
      updateEventStore(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      toast.success('Evento cancelado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cancelar evento');
    },
  });

  return {
    events,
    isLoadingEvents,
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    cancelEvent: cancelEventMutation.mutate,
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
    isCancelling: cancelEventMutation.isPending,
  };
};