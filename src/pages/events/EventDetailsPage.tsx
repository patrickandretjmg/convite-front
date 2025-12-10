import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Ban,
  Share2,
  QrCode,
  Users,
  Link2,
  Copy,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { useEventDetails } from '../../hooks/useEventDetails';
import { useEvents } from '../../hooks/useEvents';
import { usePermissions } from '../../hooks/usePermissions';
import { GuestListSection } from '../../components/events/GuestListSection';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading } = useEventDetails(id!);
  const { deleteEvent, cancelEvent, isDeleting, isCancelling } = useEvents();
  const { canEditEvent, canDeleteEvent, canManageMembers, canManageGuests, canCheckIn } = usePermissions(event || undefined);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleDelete = () => {
    if (id) {
      deleteEvent(id);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      cancelEvent(id);
      setShowCancelModal(false);
    }
  };

  const handleCopyPublicLink = () => {
    const publicLink = `${window.location.origin}/${event?.slug}/confirmar`;
    navigator.clipboard.writeText(publicLink);
    toast.success('Link público copiado! 📋');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Evento Não Encontrado
          </h1>
          <Link to="/events">
            <Button variant="primary" className="mt-4">
              Voltar para Eventos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isCancelled = event.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para eventos
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary">{event.name}</h1>
                {isCancelled && (
                  <span className="px-3 py-1 bg-error/10 text-error text-sm font-medium rounded-full">
                    Cancelado
                  </span>
                )}
                {isPast && !isCancelled && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    Realizado
                  </span>
                )}
              </div>
              {event.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informações do Evento */}
            <div className="card">
              <h2 className="text-xl font-bold text-primary mb-4">Informações do Evento</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Data</p>
                    <p className="text-gray-600">
                      {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Horário</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Local</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                {event.confirmationDeadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">Prazo de Confirmação</p>
                      <p className="text-gray-600">
                        {format(new Date(event.confirmationDeadline), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Convidados */}
            <GuestListSection event={event} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Link Público */}
            <div className="card">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Link Público
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Link de Confirmação</p>
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {window.location.origin}/{event.slug}/confirmar
                  </p>
                </div>
                {canEditEvent && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCopyPublicLink}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Link
                  </Button>
                )}
              </div>
            </div>

            {/* Ações - apenas se houver ações disponíveis */}
            {(canCheckIn || canManageGuests || canEditEvent || canManageMembers || canDeleteEvent) && (
              <div className="card">
                <h3 className="text-lg font-bold text-primary mb-4">Ações</h3>
                <div className="space-y-2">
                {canCheckIn && (
                  <Link to={`/events/${id}/check-in`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="mr-2 h-4 w-4" />
                      Scanner Check-in
                    </Button>
                  </Link>
                )}

                {(canCheckIn || canManageGuests) && (
                  <Link to={`/events/${id}/guests`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      {canManageGuests ? 'Gerenciar Convidados' : 'Ver Lista de Convidados'}
                    </Button>
                  </Link>
                )}

                {canEditEvent && (
                  <Link to={`/events/${id}/edit`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Evento
                    </Button>
                  </Link>
                )}

                {canManageMembers && (
                  <Link to={`/events/${id}/members`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Gerenciar Recepcionistas
                    </Button>
                  </Link>
                )}

                {canEditEvent && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCopyPublicLink}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar Link
                  </Button>
                )}

                {canEditEvent && !isCancelled && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-warning hover:bg-warning/10"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancelar Evento
                  </Button>
                )}

                {canDeleteEvent && (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-error hover:bg-error/10"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar Evento
                  </Button>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">Deletar Evento?</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar <strong>{event.name}</strong>? Esta ação não pode ser desfeita e todos os convidados serão removidos.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-error hover:bg-error/90"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Deletar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">Cancelar Evento?</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar <strong>{event.name}</strong>? Os convidados não poderão mais confirmar presença.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelModal(false)}
              >
                Voltar
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-warning hover:bg-warning/90"
                onClick={handleCancel}
                isLoading={isCancelling}
              >
                Cancelar Evento
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};