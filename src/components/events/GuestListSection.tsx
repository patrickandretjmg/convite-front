import { Link } from 'react-router-dom';
import { Users, Plus, CheckCircle, Clock, XCircle, ArrowRight, Loader2, Baby, UserCheck, QrCode } from 'lucide-react';
import { useGuests } from '../../hooks/useGuests';
import { Button } from '../ui/Button';
import type { Event } from '../../types';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { usePermissions } from '../../hooks/usePermissions';

interface GuestListSectionProps {
  event: Event;
}

export const GuestListSection = ({ event }: GuestListSectionProps) => {
  const { guests, isLoadingGuests } = useGuests(event.id);
  const { canManageGuests, canCheckIn } = usePermissions(event);
  
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['event-statistics', event.id],
    queryFn: () => eventService.getEventStatistics(event.id),
    refetchInterval: 5000,
    retry: false,
    enabled: !!event.id,
  });

  console.log('📊 Stats:', stats); // Debug
  
  // Valores seguros com fallback
  const safeStats = {
    total: stats?.total || 0,
    confirmed: stats?.confirmed || 0,
    pending: stats?.pending || 0,
    declined: stats?.declined || 0,
    adults: stats?.adults || 0,
    children: stats?.children || 0,
  };

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
      label: 'Pendente',
    },
    CONFIRMED: {
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
      label: 'Confirmado',
    },
    DECLINED: {
      icon: XCircle,
      color: 'text-error',
      bg: 'bg-error/10',
      label: 'Recusado',
    },
  };

  if (isLoadingGuests || isLoadingStats) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Convidados</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {safeStats.total}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to={`/events/${event.id}/check-in`}>
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Fazer Check-in
            </Button>
          </Link>
          <Link to={`/events/${event.id}/guests`}>
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {safeStats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="card bg-gradient-to-br from-primary/5 to-primary/10">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-primary">{safeStats.total + safeStats.children}</p>
          </div>
          <div className="card bg-gradient-to-br from-success/5 to-success/10">
            <p className="text-sm text-gray-600 mb-1">Confirmados</p>
            <p className="text-3xl font-bold text-success">{safeStats.confirmed}</p>
          </div>
          <div className="card bg-gradient-to-br from-warning/5 to-warning/10">
            <p className="text-sm text-gray-600 mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-warning">{safeStats.pending}</p>
          </div>
          <div className="card bg-gradient-to-br from-error/5 to-error/10">
            <p className="text-sm text-gray-600 mb-1">Recusados</p>
            <p className="text-3xl font-bold text-error">{safeStats.declined}</p>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Adultos
            </p>
            <p className="text-3xl font-bold text-blue-600">{safeStats.adults}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Baby className="h-3 w-3" />
              Crianças
            </p>
            <p className="text-3xl font-bold text-purple-600">{safeStats.children}</p>
          </div>
        </div>
      )}

      {/* Lista de Convidados */}
      {safeStats.total === 0 ? (
        /* Empty State */
        <div className="card text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Nenhum convidado cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando os convidados do seu evento
          </p>
          <Link to={`/events/${event.id}/guests`}>
            <Button variant="primary">
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Primeiro Convidado
            </Button>
          </Link>
        </div>
      ) : (
        <div className="card">
          {/* Lista Compacta */}
          <div className="space-y-3">
            {guests?.slice(0, 5).map((guest) => {
              const status = statusConfig[guest.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${status.bg}`}>
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{guest.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-mono font-semibold text-primary">{guest.uniqueCode}</span>
                        {guest.email && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{guest.email}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Ver Todos - sempre mostra quando há convidados */}
          {guests && guests.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <Link to={`/events/${event.id}/guests`}>
                <Button variant="outline" className="w-full">
                  {guests.length > 5 
                    ? `Ver Todos os Convidados (${safeStats.total || guests.length})`
                    : 'Gerenciar Convidados'
                  }
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};