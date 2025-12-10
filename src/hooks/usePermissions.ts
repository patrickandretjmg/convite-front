import { useAuthStore } from '../stores/authStore';
import type { Event, EventMemberRole } from '../types';

export const usePermissions = (event?: Event) => {
  const { user, isAdmin } = useAuthStore();

  const isOwner = event ? event.userId === user?.id : false;
  const userRole = event?.userRole;

  const canView = isAdmin() || isOwner || userRole !== undefined;

  const canCheckIn = 
    isAdmin() || 
    isOwner || 
    userRole === 'CHECKER' || 
    userRole === 'MANAGER';

  const canManageGuests = 
    isAdmin() || 
    isOwner || 
    userRole === 'MANAGER';

  const canEditEvent = isAdmin() || isOwner;

  const canDeleteEvent = isAdmin() || isOwner;

  const canManageMembers = isAdmin() || isOwner;

  return {
    canView,
    canCheckIn,
    canManageGuests,
    canEditEvent,
    canDeleteEvent,
    canManageMembers,
    isOwner,
    isAdmin: isAdmin(),
    userRole,
  };
};
