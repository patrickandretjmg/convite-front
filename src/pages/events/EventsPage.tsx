import { Link } from 'react-router-dom';
import { Plus, Calendar, Loader2 } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../../components/events/EventCard';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';

export const EventsPage = () => {
  const { events, isLoadingEvents } = useEvents();
  const { user, isAdmin } = useAuthStore();
  const { logout } = useAuth();

  const canCreateEvent = isAdmin() || (events && events.some(e => e.userId === user?.id));

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-2xl font-bold text-primary hover:underline">
              🎉 Event Invitation
            </Link>
            <nav className="flex gap-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Link to="/events" className="text-primary font-medium">
                Eventos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Meus Eventos
            </h1>
            <p className="text-gray-600">
              Gerencie todos os seus eventos em um só lugar
            </p>
          </div>
          {canCreateEvent && (
            <Link to="/events/new">
              <Button variant="primary">
                <Plus className="mr-2 h-5 w-5" />
                Criar Evento
              </Button>
            </Link>
          )}
        </div>

        {/* Loading */}
        {isLoadingEvents && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoadingEvents && (!events || events.length === 0) && (
          <div className="card text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhum evento disponível
            </h3>
            <p className="text-gray-600 mb-6">
              {canCreateEvent 
                ? 'Comece criando seu primeiro evento!' 
                : 'Você não tem acesso a nenhum evento no momento.'}
            </p>
            {canCreateEvent && (
              <Link to="/events/new">
                <Button variant="primary">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Primeiro Evento
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Events Grid */}
        {!isLoadingEvents && events && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};