import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { checkInService } from '../services/checkInService';
import { guestService } from '../services/guestService';
import type { Guest, ChildCompanion } from '../types';

export const useCheckIn = (eventId?: string) => {
  const checkInByCodeMutation = useMutation({
    mutationFn: (code: string) => checkInService.checkInByCode(code),
    onSuccess: (data) => {
      toast.success(data.message || 'Check-in realizado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao realizar check-in');
    },
  });

  const searchGuestMutation = useMutation({
    mutationFn: ({ eventId, name }: { eventId: string; name: string }) => 
      checkInService.searchGuestByName(eventId, name),
  });

  const searchChildMutation = useMutation({
    mutationFn: ({ eventId, name }: { eventId: string; name: string }) => 
      checkInService.searchChildByName(eventId, name),
  });

  const checkInChildMutation = useMutation({
    mutationFn: (childId: string) => checkInService.checkInChild(childId),
    onSuccess: () => {
      toast.success('Check-in da criança realizado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao realizar check-in');
    },
  });

  const legacyCheckInMutation = useMutation({
    mutationFn: (code: string) => guestService.checkIn(code),
    onSuccess: () => {
      toast.success('Check-in realizado com sucesso! ✅');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao realizar check-in');
    },
  });

  const { data: stats, isLoading: isLoadingStats, refetch: refetchStats } = useQuery({
    queryKey: ['checkInStats', eventId],
    queryFn: () => eventId ? checkInService.getEventStats(eventId) : Promise.resolve(null),
    enabled: !!eventId,
    refetchInterval: 30000,
  });

  return {
    checkInByCode: checkInByCodeMutation.mutateAsync,
    searchGuest: searchGuestMutation.mutateAsync,
    searchChild: searchChildMutation.mutateAsync,
    checkInChild: checkInChildMutation.mutateAsync,
    checkIn: legacyCheckInMutation.mutate,
    stats,
    isLoadingStats,
    refetchStats,
    isCheckingIn: checkInByCodeMutation.isPending || checkInChildMutation.isPending || legacyCheckInMutation.isPending,
    isSearchingGuest: searchGuestMutation.isPending,
    isSearchingChild: searchChildMutation.isPending,
  };
};