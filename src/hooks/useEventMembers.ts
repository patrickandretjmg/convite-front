import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { eventMemberService } from '../services/eventMemberService';
import type { EventMemberRole } from '../types';

export const useEventMembers = (eventId: string) => {
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['eventMembers', eventId],
    queryFn: () => eventMemberService.getEventMembers(eventId),
    enabled: !!eventId,
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ userEmail, role }: { userEmail: string; role: EventMemberRole }) =>
      eventMemberService.addEventMember(eventId, userEmail, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventMembers', eventId] });
      toast.success('Membro adicionado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar membro');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: EventMemberRole }) =>
      eventMemberService.updateEventMemberRole(eventId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventMembers', eventId] });
      toast.success('Permissão atualizada com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar permissão');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      eventMemberService.removeEventMember(eventId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventMembers', eventId] });
      toast.success('Membro removido com sucesso! 🗑️');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover membro');
    },
  });

  return {
    members: members || [],
    isLoading,
    addMember: addMemberMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    isAdding: addMemberMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isRemoving: removeMemberMutation.isPending,
  };
};
