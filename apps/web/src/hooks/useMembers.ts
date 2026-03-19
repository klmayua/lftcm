import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Types
export interface Member {
  id: string;
  userId: string;
  memberNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED';
  address?: string;
  city?: string;
  profession?: string;
  branchId: string;
  branchName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  membershipType: 'REGULAR' | 'WORKER' | 'MINISTER' | 'VISITOR' | 'ONLINE';
  joinedAt: string;
  avatarUrl?: string;
  departments?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  _count?: {
    attendanceRecords: number;
  };
}

export interface MemberFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  membershipType?: 'REGULAR' | 'WORKER' | 'MINISTER' | 'VISITOR' | 'ONLINE';
  departmentId?: string;
  search?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateMemberData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED';
  address?: string;
  city?: string;
  profession?: string;
  branchId: string;
  departmentIds?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  membershipType?: 'REGULAR' | 'WORKER' | 'MINISTER' | 'VISITOR' | 'ONLINE';
}

// Hook for fetching members list
export function useMembers(
  filters: MemberFilters = {},
  pagination: PaginationParams = {}
) {
  const [members, setMembers] = useState<Member[]>([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.membershipType) params.append('membershipType', filters.membershipType);
      if (filters.departmentId) params.append('departmentId', filters.departmentId);
      if (filters.search) params.append('search', filters.search);
      if (filters.gender) params.append('gender', filters.gender);
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);

      const response = await api.get<{ data: Member[]; pagination: typeof paginationInfo }>(
        `/members?${params.toString()}`
      );

      if (response.success && response.data) {
        setMembers(response.data.data);
        setPaginationInfo(response.data.pagination);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.status,
    filters.membershipType,
    filters.departmentId,
    filters.search,
    filters.gender,
    pagination.page,
    pagination.limit,
    pagination.sortBy,
    pagination.sortOrder,
  ]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    pagination: paginationInfo,
    isLoading,
    error,
    refetch: fetchMembers,
  };
}

// Hook for fetching a single member
export function useMember(id: string | null) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMember = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Member>(`/members/${id}`);

      if (response.success && response.data) {
        setMember(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch member');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  return {
    member,
    isLoading,
    error,
    refetch: fetchMember,
  };
}

// Hook for member CRUD operations
export function useMemberMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMember = useCallback(async (data: CreateMemberData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Member>('/members', data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to create member');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMember = useCallback(async (id: string, data: Partial<CreateMemberData>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch<Member>(`/members/${id}`, data);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to update member');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMember = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/members/${id}`);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete member');
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
    createMember,
    updateMember,
    deleteMember,
    isLoading,
    error,
  };
}

// Hook for member statistics
export function useMemberStats(branchId?: string) {
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    byGender: Record<string, number>;
    byMembershipType: Record<string, number>;
    newThisMonth: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = branchId ? `?branchId=${branchId}` : '';
      const response = await api.get<typeof stats>(`/members/stats${params}`);

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
  }, [branchId]);

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
