import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Users, Baby } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEventDetails } from '../../hooks/useEventDetails';
import { checkInService } from '../../services/checkInService';
import { Button } from '../../components/ui/Button';

export const CheckInListPage = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const { event, isLoading: isLoadingEvent } = useEventDetails(eventId!);
  
  const { data, isLoading: isLoadingGuests } = useQuery({
    queryKey: ['check-in-list', eventId],
    queryFn: () => checkInService.getCheckInList(eventId!),
    enabled: !!eventId,
    refetchInterval: 5000,
  });

  const guests = data?.guests || [];
  const stats = data?.stats;

  if (isLoadingEvent || isLoadingGuests) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
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

  const checkedInGuests = guests?.filter(g => g.hasCheckedIn) || [];
  const pendingGuests = guests?.filter(g => !g.hasCheckedIn) || [];

  const totalAdults = stats?.adults?.total || 0;
  const checkedInAdults = stats?.adults?.checkedIn || 0;
  const totalChildren = stats?.children?.total || 0;
  const checkedInChildren = stats?.children?.checkedIn || 0;
  const totalPeople = stats?.overall?.total || 0;
  const totalCheckedIn = stats?.overall?.checkedIn || 0;
  const totalPending = stats?.overall?.pending || 0;

  return (
    <div className="min-h-screen bg-secondary-light">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to={`/events/${eventId}/check-in`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Check-in
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Lista de Check-in</h1>
                <p className="text-gray-600">{event.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card bg-blue-50 border-blue-200">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600 font-medium">Total Convidados</p>
              <p className="text-3xl font-bold text-blue-700">{totalPeople}</p>
            </div>
          </div>

          <div className="card bg-green-50 border-green-200">
            <div className="text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-600 font-medium">Check-in Feitos</p>
              <p className="text-3xl font-bold text-green-700">{totalCheckedIn}</p>
            </div>
          </div>

          <div className="card bg-orange-50 border-orange-200">
            <div className="text-center">
              <XCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-600 font-medium">Faltam</p>
              <p className="text-3xl font-bold text-orange-700">{totalPending}</p>
            </div>
          </div>

          <div className="card bg-indigo-50 border-indigo-200">
            <div className="text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-indigo-600 font-medium">Adultos</p>
              <p className="text-3xl font-bold text-indigo-700">{totalAdults}</p>
            </div>
          </div>

          <div className="card bg-purple-50 border-purple-200">
            <div className="text-center">
              <Baby className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-600 font-medium">Crianças</p>
              <p className="text-3xl font-bold text-purple-700">{totalChildren}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-700">
                Check-in Realizados ({checkedInGuests.length})
              </h2>
            </div>

            {checkedInGuests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum check-in realizado ainda
              </p>
            ) : (
              <div className="space-y-3">
                {checkedInGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Código: {guest.uniqueCode}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    </div>

                    {guest.children && guest.children.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-300">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Crianças:
                        </p>
                        <div className="space-y-1">
                          {guest.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className={child.hasCheckedIn ? 'text-green-700' : 'text-gray-600'}>
                                {child.name} ({child.age} anos)
                              </span>
                              {child.hasCheckedIn ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold text-orange-700">
                Aguardando Check-in ({pendingGuests.length})
              </h2>
            </div>

            {pendingGuests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Todos os convidados já fizeram check-in!
              </p>
            ) : (
              <div className="space-y-3">
                {pendingGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Código: {guest.uniqueCode}
                        </p>
                      </div>
                      <XCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    </div>

                    {guest.children && guest.children.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-orange-300">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Crianças:
                        </p>
                        <div className="space-y-1">
                          {guest.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-600">
                                {child.name} ({child.age} anos)
                              </span>
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
