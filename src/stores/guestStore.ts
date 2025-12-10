import { create } from 'zustand';
import type { Guest, GuestFilters } from '../types';

interface GuestStore {
  guests: Guest[];
  filters: GuestFilters;
  
  setGuests: (guests: Guest[]) => void;
  setFilters: (filters: Partial<GuestFilters>) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  clearGuests: () => void;
}

export const useGuestStore = create<GuestStore>((set) => ({
  guests: [],
  filters: {
    status: 'ALL',
    search: '',
  },
  
  setGuests: (guests) => set({ guests }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  addGuest: (guest) => set((state) => ({
    guests: [...state.guests, guest],
  })),
  
  updateGuest: (id, data) => set((state) => ({
    guests: state.guests.map((g) => (g.id === id ? { ...g, ...data } : g)),
  })),
  
  deleteGuest: (id) => set((state) => ({
    guests: state.guests.filter((g) => g.id !== id),
  })),
  
  clearGuests: () => set({ guests: [] }),
}));