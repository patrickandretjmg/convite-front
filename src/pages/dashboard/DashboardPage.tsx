import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, CheckCircle, Ban, Loader2, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { StatCard } from '../../components/dashboard/StatCard';
import { EventQuickCard } from '../../components/dashboard/EventQuickCard';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';

export const DashboardPage = () => {
  const { stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      navigate('/events', { replace: true });
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const hasEvents = stats && stats.totalEvents > 0;
  const hasUpcoming = stats && stats.upcomingEvents.length > 0;

  return (
    <div className="min-h-screen bg-secondary-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bem-vindo ao seu painel de controle de eventos
              </p>
            </div>
            <Link to="/events/new">
              <Button variant="primary" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Evento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        {hasEvents && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Eventos"
              value={stats.totalEvents}
              icon={Calendar}
              color="primary"
            />
            <StatCard
              title="Eventos Ativos"
              value={stats.activeEvents}
              icon={CheckCircle}
              color="success"
              subtitle={`${stats.upcomingEvents.length} próximos`}
            />
            <StatCard
              title="Eventos Realizados"
              value={stats.pastEvents}
              icon={CheckCircle}
              color="primary"
            />
            <StatCard
              title="Cancelados"
              value={stats.cancelledEvents}
              icon={Ban}
              color="error"
            />
          </div>
        )}

        {/* Next Event Highlight */}
        {stats?.nextEvent && (
          <div className="card mb-8 bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">Próximo Evento</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{stats.nextEvent.name}</h2>
                <p className="text-white/90 mb-4">
                  {format(new Date(stats.nextEvent.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-sm">{stats.nextEvent.location}</span>
                </div>
              </div>
              <Link to={`/events/${stats.nextEvent.id}`}>
                <Button variant="secondary" size="sm">
                  Ver Detalhes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {hasUpcoming ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Próximos Eventos</h2>
              <Link to="/events">
                <Button variant="outline" size="sm">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.upcomingEvents.map((event) => (
                <EventQuickCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : hasEvents ? (
          /* Tem eventos mas nenhum próximo */
          <div className="card text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Nenhum Evento Próximo
            </h3>
            <p className="text-gray-600 mb-6">
              Todos os seus eventos já ocorreram ou foram cancelados.
            </p>
            <Link to="/events/new">
              <Button variant="primary">
                <Plus className="mr-2 h-5 w-5" />
                Criar Novo Evento
              </Button>
            </Link>
          </div>
        ) : (
          /* Empty State - Nenhum evento */
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">
                Bem-vindo! 🎉
              </h2>
              <p className="text-gray-600 mb-8">
                Você ainda não criou nenhum evento. Comece criando seu primeiro evento
                e convide seus convidados de forma prática e moderna!
              </p>
              <Link to="/events/new">
                <Button variant="primary" size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Meu Primeiro Evento
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {hasEvents && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-primary mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/events/new" className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Criar Evento</p>
                    <p className="text-sm text-gray-600">Novo evento com convites</p>
                  </div>
                </div>
              </Link>

              <Link to="/events" className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Ver Eventos</p>
                    <p className="text-sm text-gray-600">Gerenciar todos os eventos</p>
                  </div>
                </div>
              </Link>

              <Link to="/profile" className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Meu Perfil</p>
                    <p className="text-sm text-gray-600">Configurações da conta</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};