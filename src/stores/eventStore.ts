import { create } from 'zustand';
import type { Event } from '../types';

interface EventStore {
  events: Event[];
  currentEvent: Event | null;
  
  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  currentEvent: null,
  
  setEvents: (events) => set({ events }),
  
  setCurrentEvent: (event) => set({ currentEvent: event }),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event],
  })),
  
  updateEvent: (id, data) => set((state) => ({
    events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
    currentEvent: state.currentEvent?.id === id
      ? { ...state.currentEvent, ...data }
      : state.currentEvent,
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
    currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
  })),
}));