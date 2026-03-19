// API and Auth
export { api, apiClient, ApiError } from '@/lib/api';
export {
  useAuth,
  login,
  register,
  logout,
  getCurrentUser,
  refreshAccessToken,
  setTokens,
  getTokens,
  clearTokens,
  setUser,
  getUser,
} from '@/lib/auth';
export type { User, AuthTokens, LoginCredentials, RegisterData } from '@/lib/auth';

// Members
export {
  useMembers,
  useMember,
  useMemberMutations,
  useMemberStats,
} from './useMembers';
export type { Member, MemberFilters, CreateMemberData } from './useMembers';

// Events
export {
  useEvents,
  useEvent,
  useEventMutations,
  useUpcomingEvents,
} from './useEvents';
export type { Event, EventFilters, CreateEventData } from './useEvents';

// Sermons
export {
  useSermons,
  useSermon,
  useSermonMutations,
  useSermonSeries,
  useLatestSermons,
} from './useSermons';
export type { Sermon, SermonSeries, SermonFilters, CreateSermonData } from './useSermons';

// Giving
export {
  useGivingHistory,
  useMyGiving,
  useProjects,
  usePaymentMutations,
  useGivingStats,
} from './useGiving';
export type { Donation, Project, PaymentRequest, PaymentResponse } from './useGiving';

// Accessibility
export { useReducedMotion, useAccessibleAnimation } from './useReducedMotion';

// PWA
export {
  usePushNotifications,
  useNetworkStatus,
  useBackgroundSync,
} from './usePushNotifications';

// Features
export {
  useFeature,
  useEnabledFeatures,
  usePhase,
  FeatureGate,
  PhaseGate,
} from './useFeatures';
export type { Feature } from './useFeatures';

// VNFTF
export {
  useVNFTFVoiceNotes,
  useVNFTFStats,
  useVNFTFAccounts,
  useLinkVNFTFAccount,
  useSyncVNFTF,
} from './useVNFTF';
export type { VNFTFVoiceNote, VNFTFStats, VNFTFAccount } from './useVNFTF';
