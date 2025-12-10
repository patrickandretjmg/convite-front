import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import type { Event } from '../../types';

interface EventQuickCardProps {
  event: Event;
}

export const EventQuickCard = ({ event }: EventQuickCardProps) => {
  const eventDate = new Date(event.date);
  const now = new Date();
  const isPast = eventDate < now;
  const isCancelled = event.status === 'CANCELLED';
  const isToday = format(eventDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

  // Deadline próximo
  const hasDeadline = event.confirmationDeadline && new Date(event.confirmationDeadline) > now;
  const deadlineClose = hasDeadline && 
    new Date(event.confirmationDeadline!).getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000; // 3 dias

  return (
    <Link to={`/events/${event.id}`}>
      <div className="card hover:shadow-lg transition-all hover:border-primary cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
              {event.name}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {event.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
        </div>

        {/* Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className={isToday ? 'font-bold text-primary' : 'text-gray-600'}>
              {isToday ? 'Hoje' : format(eventDate, "dd/MM/yyyy", { locale: ptBR })}
              {!isPast && !isToday && (
                <span className="text-gray-500 ml-2">
                  ({formatDistanceToNow(eventDate, { locale: ptBR, addSuffix: true })})
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {isCancelled && (
            <span className="px-2 py-1 bg-error/10 text-error text-xs font-medium rounded">
              Cancelado
            </span>
          )}
          {isPast && !isCancelled && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              Realizado
            </span>
          )}
          {isToday && !isCancelled && (
            <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded animate-pulse">
              Hoje
            </span>
          )}
          {deadlineClose && (
            <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Prazo próximo
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};