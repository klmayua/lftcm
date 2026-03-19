import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Types
export interface Donation {
  id: string;
  amount: string;
  currency: string;
  donationType: 'TITHE' | 'OFFERING' | 'PROJECT' | 'MISSIONS' | 'BUILDING_FUND' | 'CHARITY' | 'OTHER';
  paymentMethod: 'MTN_MOBILE_MONEY' | 'ORANGE_MONEY' | 'CASH' | 'BANK_TRANSFER' | 'CARD';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  transactionId?: string;
  receiptNumber?: string;
  userId?: string;
  donorName?: string;
  donorEmail?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  donatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  goal?: string;
  raised: string;
  imageUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  progress: number;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber?: string;
  provider: 'MTN' | 'ORANGE' | 'PAYSTACK';
  description?: string;
  donationType: Donation['donationType'];
  projectId?: string;
  donorName?: string;
  donorEmail?: string;
  callbackUrl?: string;
  channels?: string[];
}

export interface PaymentResponse {
  transactionId: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  provider: string;
  phoneNumber?: string;
  message: string;
  // Paystack specific
  authorizationUrl?: string;
  accessCode?: string;
}

// Hook for fetching giving history
export function useGivingHistory(
  filters: { status?: Donation['paymentStatus'] } = {},
  pagination: { page?: number; limit?: number } = {}
) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());

      const response = await api.get<{ data: Donation[]; pagination: typeof paginationInfo }>(
        `/giving?${params.toString()}`
      );

      if (response.success && response.data) {
        setDonations(response.data.data);
        setPaginationInfo(response.data.pagination);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch giving history');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    donations,
    pagination: paginationInfo,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}

// Hook for user's own giving history
export function useMyGiving() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyGiving = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Donation[]>('/giving/my-history');

      if (response.success && response.data) {
        setDonations(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch giving history');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyGiving();
  }, [fetchMyGiving]);

  return {
    donations,
    isLoading,
    error,
    refetch: fetchMyGiving,
  };
}

// Hook for active projects
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Project[]>('/giving/projects');

      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}

// Hook for payment mutations
export function usePaymentMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initiatePayment = useCallback(async (data: PaymentRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<PaymentResponse>('/giving/pay', data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to initiate payment');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (transactionId: string, provider: 'MTN' | 'ORANGE' | 'PAYSTACK') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{ status: Donation['paymentStatus'] }>('/giving/verify', {
        transactionId,
        provider,
      });

      if (response.success && response.data) {
        return response.data.status;
      }
      throw new Error(response.error?.message || 'Failed to verify payment');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReceipt = useCallback(async (donationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<{ receiptNumber: string }>(`/giving/${donationId}/receipt`);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to generate receipt');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    initiatePayment,
    verifyPayment,
    generateReceipt,
    isLoading,
    error,
  };
}

// Hook for giving statistics
export function useGivingStats() {
  const [stats, setStats] = useState<{
    summary: {
      total: number;
      completed: number;
      pending: number;
      failed: number;
      totalAmount: string;
    };
    byType: Array<{
      type: string;
      amount: string;
      count: number;
    }>;
    byMethod: Array<{
      method: string;
      amount: string;
      count: number;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<typeof stats>('/giving/stats/summary');

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
