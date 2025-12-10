import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const isCancelled = event.status === 'CANCELLED';

  const statusColors = {
    ACTIVE: 'bg-success text-white',
    CANCELLED: 'bg-error text-white',
    COMPLETED: 'bg-gray-500 text-white',
  };

  const statusLabels = {
    ACTIVE: 'Ativo',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Concluído',
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary mb-1">
            {event.name}
          </h3>
          {event.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
          {statusLabels[event.status]}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            {isPast && !isCancelled && ' (Passou)'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Users className="h-4 w-4" />
          <span className="text-sm">Ver convidados</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link to={`/events/${event.id}`} className="flex-1">
          <Button variant="primary" className="w-full" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>
        </Link>
      </div>

      {/* Slug */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Link público: <span className="font-mono text-primary">/{event.slug}</span>
        </p>
      </div>
    </div>
  );
};