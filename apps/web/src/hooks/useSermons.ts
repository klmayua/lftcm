import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Types
export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description?: string;
  seriesId?: string;
  seriesName?: string;
  seriesOrder?: number;
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
  duration?: number;
  scripture: string[];
  topics: string[];
  speaker: string;
  preachedAt: string;
  thumbnailUrl?: string;
  viewCount: number;
  downloadCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SermonSeries {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  sermonCount: number;
  startDate?: string;
  endDate?: string;
}

export interface SermonFilters {
  seriesId?: string;
  speaker?: string;
  search?: string;
  isPublished?: boolean;
}

export interface CreateSermonData {
  title: string;
  description?: string;
  seriesId?: string;
  seriesOrder?: number;
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
  duration?: number;
  scripture?: string[];
  topics?: string[];
  speaker: string;
  preachedAt: string;
  thumbnailUrl?: string;
  isPublished?: boolean;
}

// Hook for fetching sermons
export function useSermons(
  filters: SermonFilters = {},
  pagination: { page?: number; limit?: number } = {}
) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSermons = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.seriesId) params.append('seriesId', filters.seriesId);
      if (filters.speaker) params.append('speaker', filters.speaker);
      if (filters.search) params.append('search', filters.search);
      if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished.toString());
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());

      const response = await api.get<{ data: Sermon[]; pagination: typeof paginationInfo }>(
        `/sermons?${params.toString()}`
      );

      if (response.success && response.data) {
        setSermons(response.data.data);
        setPaginationInfo(response.data.pagination);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch sermons');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.seriesId,
    filters.speaker,
    filters.search,
    filters.isPublished,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  return {
    sermons,
    pagination: paginationInfo,
    isLoading,
    error,
    refetch: fetchSermons,
  };
}

// Hook for fetching a single sermon
export function useSermon(slug: string | null) {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSermon = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Sermon>(`/sermons/${slug}`);

      if (response.success && response.data) {
        setSermon(response.data);
        // Track view (optional)
        trackSermonView(response.data.id);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch sermon');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchSermon();
  }, [fetchSermon]);

  return {
    sermon,
    isLoading,
    error,
    refetch: fetchSermon,
  };
}

// Track sermon view
async function trackSermonView(sermonId: string) {
  try {
    await api.post(`/sermons/${sermonId}/view`, {});
  } catch {
    // Silently fail - tracking is not critical
  }
}

// Hook for sermon CRUD operations
export function useSermonMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSermon = useCallback(async (data: CreateSermonData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Sermon>('/sermons', data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to create sermon');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSermon = useCallback(async (id: string, data: Partial<CreateSermonData>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch<Sermon>(`/sermons/${id}`, data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to update sermon');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSermon = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/sermons/${id}`);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete sermon');
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
    createSermon,
    updateSermon,
    deleteSermon,
    isLoading,
    error,
  };
}

// Hook for sermon series
export function useSermonSeries() {
  const [series, setSeries] = useState<SermonSeries[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSeries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<SermonSeries[]>('/sermons/series');

      if (response.success && response.data) {
        setSeries(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch series');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  return {
    series,
    isLoading,
    error,
    refetch: fetchSeries,
  };
}

// Hook for latest sermons (for homepage)
export function useLatestSermons(limit: number = 5) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{ data: Sermon[] }>(
          `/sermons?isPublished=true&limit=${limit}&sortBy=preachedAt&sortOrder=desc`
        );

        if (response.success && response.data) {
          setSermons(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatest();
  }, [limit]);

  return {
    sermons,
    isLoading,
    error,
  };
}
