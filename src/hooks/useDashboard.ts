import { useQuery } from '@tanstack/react-query';
import { useEvents } from './useEvents';
import type { Event } from '../types';

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  upcomingEvents: Event[];
  pastEvents: number;
  cancelledEvents: number;
  nextEvent: Event | null;
}

export const useDashboard = () => {
  const { events, isLoadingEvents } = useEvents();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', events],
    queryFn: (): DashboardStats => {
      if (!events) {
        return {
          totalEvents: 0,
          activeEvents: 0,
          upcomingEvents: [],
          pastEvents: 0,
          cancelledEvents: 0,
          nextEvent: null,
        };
      }

      const now = new Date();

      const activeEvents = events.filter((e) => e.status === 'ACTIVE');
      const upcomingEvents = activeEvents
        .filter((e) => new Date(e.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const pastEvents = events.filter((e) => new Date(e.date) < now && e.status !== 'CANCELLED');
      const cancelledEvents = events.filter((e) => e.status === 'CANCELLED');

      return {
        totalEvents: events.length,
        activeEvents: activeEvents.length,
        upcomingEvents: upcomingEvents.slice(0, 5), // Próximos 5
        pastEvents: pastEvents.length,
        cancelledEvents: cancelledEvents.length,
        nextEvent: upcomingEvents[0] || null,
      };
    },
    enabled: !!events,
  });

  return {
    stats,
    isLoading: isLoadingEvents,
  };
};