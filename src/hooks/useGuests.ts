import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { guestService } from '../services/guestService';
import { useGuestStore } from '../stores/guestStore';

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

export const useGuests = (eventId?: string) => {
  const queryClient = useQueryClient();
  const { setGuests, addGuest, updateGuest: updateGuestStore, deleteGuest: deleteGuestStore } = useGuestStore();

  // Listar convidados do evento
  const { data: guests, isLoading: isLoadingGuests } = useQuery({
    queryKey: ['guests', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      const data = await guestService.getGuestsByEvent(eventId);
      setGuests(data);
      return data;
    },
    enabled: !!eventId,
  });

  // Criar convidado
  const createGuestMutation = useMutation({
    mutationFn: (guestData: CreateGuestData) => guestService.createGuest(guestData),
    onSuccess: (data) => {
      addGuest(data);
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      toast.success('Convidado adicionado com sucesso! 👤');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar convidado');
    },
  });

  // Atualizar convidado
  const updateGuestMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuestData }) =>
      guestService.updateGuest(id, data),
    onSuccess: (data) => {
      updateGuestStore(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      toast.success('Convidado atualizado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar convidado');
    },
  });

  // Deletar convidado
  const deleteGuestMutation = useMutation({
    mutationFn: (id: string) => guestService.deleteGuest(id),
    onSuccess: (_, id) => {
      deleteGuestStore(id);
      queryClient.invalidateQueries({ queryKey: ['guests', eventId] });
      toast.success('Convidado removido com sucesso! 🗑️');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover convidado');
    },
  });

  return {
    guests,
    isLoadingGuests,
    createGuest: createGuestMutation.mutate,
    updateGuest: updateGuestMutation.mutate,
    deleteGuest: deleteGuestMutation.mutate,
    isCreating: createGuestMutation.isPending,
    isUpdating: updateGuestMutation.isPending,
    isDeleting: deleteGuestMutation.isPending,
  };
};