import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'SERVICE' | 'CONFERENCE' | 'RETREAT' | 'TRAINING' | 'SOCIAL' | 'OUTREACH' | 'FUNDRAISER' | 'WEDDING' | 'FUNERAL' | 'OTHER';
  category?: string;
  startDate: string;
  endDate?: string;
  timezone: string;
  isVirtual: boolean;
  location?: string;
  address?: string;
  virtualLink?: string;
  maxAttendees?: number;
  requiresRegistration: boolean;
  registrationFee?: string;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  registrationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  status?: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  type?: Event['type'];
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  type: Event['type'];
  category?: string;
  startDate: string;
  endDate?: string;
  timezone?: string;
  isVirtual?: boolean;
  location?: string;
  address?: string;
  virtualLink?: string;
  maxAttendees?: number;
  requiresRegistration?: boolean;
  registrationFee?: string;
  currency?: string;
}

// Hook for fetching events
export function useEvents(
  filters: EventFilters = {},
  pagination: { page?: number; limit?: number } = {}
) {
  const [events, setEvents] = useState<Event[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());

      const response = await api.get<{ data: Event[]; pagination: typeof paginationInfo }>(
        `/events?${params.toString()}`
      );

      if (response.success && response.data) {
        setEvents(response.data.data);
        setPaginationInfo(response.data.pagination);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.status,
    filters.type,
    filters.search,
    filters.startDate,
    filters.endDate,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    pagination: paginationInfo,
    isLoading,
    error,
    refetch: fetchEvents,
  };
}

// Hook for fetching a single event
export function useEvent(id: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Event>(`/events/${id}`);

      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch event');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    error,
    refetch: fetchEvent,
  };
}

// Hook for event CRUD operations
export function useEventMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = useCallback(async (data: CreateEventData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Event>('/events', data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to create event');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, data: Partial<CreateEventData>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch<Event>(`/events/${id}`, data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to update event');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/events/${id}`);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete event');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerForEvent = useCallback(async (eventId: string, registrationData: {
    name: string;
    email: string;
    phone?: string;
    dietaryRequirements?: string;
    specialNeeds?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(`/events/${eventId}/register`, registrationData);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to register for event');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    isLoading,
    error,
  };
}

// Hook for upcoming events (for homepage)
export function useUpcomingEvents(limit: number = 5) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setIsLoading(true);
      try {
        const now = new Date().toISOString();
        const response = await api.get<{ data: Event[] }>(
          `/events?status=PUBLISHED&startDate=${now}&limit=${limit}&sortBy=startDate&sortOrder=asc`
        );

        if (response.success && response.data) {
          setEvents(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcoming();
  }, [limit]);

  return {
    events,
    isLoading,
    error,
  };
}
