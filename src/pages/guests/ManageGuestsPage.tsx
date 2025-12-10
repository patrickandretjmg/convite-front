import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Loader2, Filter, Baby, UserCheck, LayoutGrid, TableIcon, QrCode } from 'lucide-react';
import { useEventDetails } from '../../hooks/useEventDetails';
import { useGuests } from '../../hooks/useGuests';
import { useGuestStore } from '../../stores/guestStore';
import { GuestCard } from '../../components/guests/GuestCard';
import { GuestTable } from '../../components/guests/GuestTable';
import { GuestFormModal } from '../../components/guests/GuestFormModal';
import { ChildCompanionCard } from '../../components/events/ChildCompanionCard';
import { ChildrenTable } from '../../components/guests/ChildrenTable';
import { Button } from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import type { Guest, ChildCompanion } from '../../types';
import type { CreateGuestInput, UpdateGuestInput } from '../../schemas/guestSchemas';
import { childCompanionService } from '../../services/childCompanionService';
import { eventService } from '../../services/eventService';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const ManageGuestsPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { event, isLoading: isLoadingEvent } = useEventDetails(eventId!);
  const { guests, isLoadingGuests, createGuest, updateGuest, deleteGuest, isCreating, isUpdating } = useGuests(eventId);
  const { filters, setFilters } = useGuestStore();
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [children, setChildren] = useState<ChildCompanion[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [isRemovingChild, setIsRemovingChild] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const { data: statsData } = useQuery({
    queryKey: ['event-statistics', eventId],
    queryFn: () => eventService.getEventStatistics(eventId!),
    enabled: !!eventId,
    refetchInterval: 5000,
  });

  // Filtrar convidados
  const filteredGuests = guests?.filter((guest) => {
    // Filtro por status
    if (filters.status !== 'ALL' && guest.status !== filters.status) {
      return false;
    }
    
    // Filtro por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        guest.name.toLowerCase().includes(searchLower) ||
        guest.code.toLowerCase().includes(searchLower) ||
        guest.email?.toLowerCase().includes(searchLower) ||
        guest.phone?.includes(filters.search)
      );
    }
    
    return true;
  }) || [];

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowFormModal(true);
  };

  const handleDelete = (guest: Guest) => {
    setSelectedGuest(guest);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedGuest) {
      deleteGuest(selectedGuest.id);
      setShowDeleteModal(false);
      setSelectedGuest(null);
    }
  };

  const handleFormSubmit = (data: CreateGuestInput | UpdateGuestInput) => {
    if (selectedGuest) {
      // Editar
      updateGuest({ id: selectedGuest.id, data: data as UpdateGuestInput });
    } else {
      // Criar
      createGuest(data as CreateGuestInput);
    }
    setShowFormModal(false);
    setSelectedGuest(null);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setSelectedGuest(null);
  };

  // Stats
  const stats = {
    total: statsData?.total || 0,
    confirmed: statsData?.confirmed || 0,
    pending: statsData?.pending || 0,
    declined: statsData?.declined || 0,
    adults: statsData?.adults || 0,
    children: statsData?.children || 0,
  };

  useEffect(() => {
    const loadChildren = async () => {
      if (!eventId) return;
      
      setIsLoadingChildren(true);
      try {
        const allChildren: ChildCompanion[] = [];
        
        if (guests) {
          for (const guest of guests) {
            if (guest.status === 'CONFIRMED') {
              try {
                const guestChildren = await childCompanionService.getGuestChildren(guest.code);
                allChildren.push(...guestChildren);
              } catch (error) {
                console.error(`Erro ao carregar crianças do convidado ${guest.code}:`, error);
              }
            }
          }
        }
        
        setChildren(allChildren);
      } catch (error) {
        console.error('Erro ao carregar crianças:', error);
      } finally {
        setIsLoadingChildren(false);
      }
    };

    loadChildren();
  }, [eventId, guests]);

  const handleRemoveChild = async (childId: string) => {
    setIsRemovingChild(true);
    try {
      await childCompanionService.removeChildCompanion(childId);
      toast.success('Criança removida com sucesso');
      setChildren(children.filter(c => c.id !== childId));
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover criança');
    } finally {
      setIsRemovingChild(false);
    }
  };

  if (isLoadingEvent) {
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

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para detalhes do evento
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">{event.name}</h1>
              <p className="text-gray-600">Gerenciar Convidados</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/events/${eventId}/check-in`}>
                <Button variant="outline">
                  <QrCode className="mr-2 h-5 w-5" />
                  Fazer Check-in
                </Button>
              </Link>
              <Button variant="primary" onClick={() => setShowFormModal(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Adicionar Convidado
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-primary">{stats.total + stats.children}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Confirmados</p>
            <p className="text-3xl font-bold text-success">{stats.confirmed}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-warning">{stats.pending}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Recusados</p>
            <p className="text-3xl font-bold text-error">{stats.declined}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Adultos
            </p>
            <p className="text-3xl font-bold text-blue-600">{stats.adults}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Baby className="h-3 w-3" />
              Crianças
            </p>
            <p className="text-3xl font-bold text-purple-600">{stats.children}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filtros:</span>
            </div>
            
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendentes</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="DECLINED">Recusados</option>
            </select>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar por nome, código, email..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {/* Clear Filters */}
            {(filters.status !== 'ALL' || filters.search) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ status: 'ALL', search: '' })}
              >
                Limpar Filtros
              </Button>
            )}

            {/* View Mode Toggle */}
            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === 'cards' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                title="Visualizar em cards"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                title="Visualizar em tabela"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoadingGuests && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoadingGuests && (!guests || guests.length === 0) && (
          <div className="card text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhum convidado cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando os primeiros convidados do evento!
            </p>
            <Button variant="primary" onClick={() => setShowFormModal(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Adicionar Primeiro Convidado
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoadingGuests && guests && guests.length > 0 && filteredGuests.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-600">Nenhum convidado encontrado com os filtros aplicados.</p>
          </div>
        )}

        {/* Guests Grid or Table */}
        {!isLoadingGuests && filteredGuests.length > 0 && (
          <>
            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredGuests.map((guest) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    eventSlug={event.slug}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="mb-8">
                <GuestTable
                  guests={filteredGuests}
                  eventSlug={event.slug}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </>
        )}

        {/* Children Section */}
        {!isLoadingChildren && children.length > 0 && (
          <div className="mt-8">
            {viewMode === 'cards' ? (
              <div className="card">
                <div className="flex items-center gap-2 mb-6">
                  <Baby className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-purple-800">
                    Crianças Cadastradas ({children.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => {
                    const responsavel = guests?.find(g => g.code === child.guestCode);
                    return (
                      <ChildCompanionCard
                        key={child.id}
                        child={child}
                        guestName={responsavel?.name}
                        guestCode={responsavel?.code}
                        onRemove={handleRemoveChild}
                        isRemoving={isRemovingChild}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <ChildrenTable
                children={children}
                getGuestName={(guestCode) => guests?.find(g => g.code === guestCode)?.name}
                onRemove={handleRemoveChild}
                isRemoving={isRemovingChild}
              />
            )}
          </div>
        )}
      </main>

      {/* Guest Form Modal */}
      <GuestFormModal
        eventId={eventId!}
        guest={selectedGuest}
        isOpen={showFormModal}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Modal */}
      {showDeleteModal && selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">
              Remover Convidado?
            </h3>
            <p className="text-gray-600 mb-2">
              Tem certeza que deseja remover <strong>{selectedGuest.name}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Código: <span className="font-mono">{selectedGuest.code}</span>
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedGuest(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-error hover:bg-error/90"
                onClick={confirmDelete}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};