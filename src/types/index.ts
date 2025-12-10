export type UserRole = 'ADMIN' | 'USER';
export type EventMemberRole = 'VIEWER' | 'CHECKER' | 'MANAGER';

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  slug: string;
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  confirmationDeadline?: string;
  idadeLimiteCriancaSemCodigo?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  userRole?: EventMemberRole;
}

export interface EventMember {
  id: string;
  eventId: string;
  userId: string;
  role: EventMemberRole;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// ---------- GUEST ----------
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;

  // Backend field
  code: string;

  // Alias used in the frontend
  uniqueCode?: string;

  status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
  eventId: string;
  confirmedAt?: string;
  checkedInAt?: string;

  // Derived property used in several screens
  hasCheckedIn?: boolean;

  companionId?: string;
  companion?: {
    id: string;
    name: string;
    code: string;
    status: 'PENDING' | 'CONFIRMED' | 'DECLINED';
    email?: string;
    phone?: string;
  };

  // Children companions for check-in pages
  children?: ChildCompanion[];

  createdAt: string;
  updatedAt: string;
}

export interface GuestFilters {
  status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'DECLINED';
  search: string;
}

export interface GuestWithEvent extends Omit<Guest, 'eventId'> {
  event: Event;
}

// ---------- API ----------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    isEmailVerified: boolean;
    role: UserRole;
  };
  token: string;
}

// ---------- CHILD COMPANIONS ----------
export interface ChildCompanion {
  id: string;
  name: string;
  age: number;

  guestCode: string;

  confirmedAt: string;
  checkedInAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AddChildCompanionRequest {
  name: string;
  age: number;
  guestCode: string;
}

export interface AddChildCompanionResponse {
  success: boolean;
  data?: ChildCompanion;
  message: string;
}

// ---------- CHECK-IN ----------
export interface CheckInStats {
  // Structure expected by CheckInPage and CheckInListPage
  adults?: {
    total: number;
    checkedIn: number;
  };

  children?: {
    total: number;
    checkedIn: number;
  };

  overall?: {
    total: number;
    checkedIn: number;
    pending: number;
  };
}

export interface CheckInByCodeRequest {
  code: string;
}

export interface CheckInByCodeResponse {
  success: boolean;
  message: string;
  data?: {
    guest?: Guest;
    child?: ChildCompanion;
  };
}
