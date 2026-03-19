'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface VNFTFVoiceNote {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration: number;
  scripture?: string[];
  publishedAt: string;
  thumbnailUrl?: string;
}

export interface VNFTFStats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalVoiceNotes: number;
  syncedVoiceNotes: number;
}

export interface VNFTFAccount {
  id: string;
  email: string;
  name: string;
  vnftfId: string;
  plan: string;
  status: string;
}

// Hook for fetching VNFTF voice notes (synced as sermons)
export function useVNFTFVoiceNotes() {
  return useQuery({
    queryKey: ['vnftf', 'voice-notes'],
    queryFn: async () => {
      const response = await api.get('/sermons?source=VNFTF');
      if (response.success && response.data) {
        return response.data as VNFTFVoiceNote[];
      }
      return [];
    },
  });
}

// Hook for fetching VNFTF stats
export function useVNFTFStats() {
  return useQuery({
    queryKey: ['vnftf', 'stats'],
    queryFn: async () => {
      const response = await api.get('/vnftf/stats');
      if (response.success && response.data) {
        return response.data as VNFTFStats;
      }
      return null;
    },
  });
}

// Hook for fetching linked VNFTF accounts
export function useVNFTFAccounts() {
  return useQuery({
    queryKey: ['vnftf', 'accounts'],
    queryFn: async () => {
      const response = await api.get('/vnftf/accounts');
      if (response.success && response.data) {
        return response.data as VNFTFAccount[];
      }
      return [];
    },
  });
}

// Hook for linking VNFTF account
export function useLinkVNFTFAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriberId: string) => {
      const response = await api.post('/vnftf/link', { subscriberId });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vnftf', 'accounts'] });
    },
  });
}

// Hook for syncing VNFTF data (admin only)
export function useSyncVNFTF() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/vnftf/sync');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vnftf'] });
    },
  });
}
