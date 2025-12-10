import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { publicService } from '../services/publicService';
import { guestService } from '../services/guestService';

export const usePublicGuest = (code?: string) => {
  const queryClient = useQueryClient();

  // Buscar convidado por código
  const { data: guest, isLoading, error } = useQuery({
    queryKey: ['public-guest', code],
    queryFn: () => publicService.getGuestByCode(code!),
    enabled: !!code,
    retry: false,
  });

  // Buscar QR Code
  const { data: qrCodeData } = useQuery({
    queryKey: ['qrcode', code],
    queryFn: () => publicService.getQRCode(code!),
    enabled: !!code && guest?.status === 'CONFIRMED',
  });

  // Confirmar presença
  const confirmMutation = useMutation({
    mutationFn: (guestCode: string) => publicService.confirmPresence(guestCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-guest', code] });
      toast.success('Presença confirmada com sucesso! 🎉');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao confirmar presença');
    },
  });

  // Recusar presença
  const declineMutation = useMutation({
    mutationFn: (guestCode: string) => publicService.declinePresence(guestCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-guest', code] });
      toast.success('Resposta registrada com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar resposta');
    },
  });

  // Adicionar acompanhante - função wrapper
  const addCompanionMutation = useMutation({
    mutationFn: ({ guestCode, companionCode }: { guestCode: string; companionCode: string }) =>
      guestService.addCompanion(guestCode, companionCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-guest', code] });
      toast.success('Acompanhante adicionado com sucesso! 🤝');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar acompanhante');
    },
  });

  // Remover acompanhante
  const removeCompanionMutation = useMutation({
    mutationFn: (guestCode: string) => guestService.removeCompanion(guestCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-guest', code] });
      toast.success('Acompanhante removido com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover acompanhante');
    },
  });

  // Wrapper functions com assinatura correta
  const handleAddCompanion = (guestCode: string, companionCode: string) => {
    addCompanionMutation.mutate({ guestCode, companionCode });
  };

  const handleRemoveCompanion = (guestCode: string) => {
    removeCompanionMutation.mutate(guestCode);
  };

  return {
    guest,
    qrCode: qrCodeData?.qrCode,
    isLoading,
    error,
    confirmPresence: confirmMutation.mutate,
    declinePresence: declineMutation.mutate,
    addCompanion: handleAddCompanion,
    removeCompanion: handleRemoveCompanion,
    isConfirming: confirmMutation.isPending,
    isDeclining: declineMutation.isPending,
    isAddingCompanion: addCompanionMutation.isPending,
    isRemovingCompanion: removeCompanionMutation.isPending,
  };
};