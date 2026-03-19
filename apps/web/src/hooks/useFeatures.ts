import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export type Feature =
  | 'public_website'
  | 'member_profiles'
  | 'sermons'
  | 'events'
  | 'online_giving'
  | 'prayer_wall'
  | 'push_notifications'
  | 'pwa'
  | 'accounting'
  | 'payroll'
  | 'attendance'
  | 'reports'
  | 'school'
  | 'facilities'
  | 'inventory'
  | 'vnftf_integration';

// Phase definitions
export const PHASES = {
  PHASE_1: ['public_website', 'member_profiles', 'sermons', 'events'] as Feature[],
  PHASE_2: ['online_giving', 'prayer_wall', 'push_notifications', 'pwa'] as Feature[],
  PHASE_3: ['accounting', 'payroll', 'attendance', 'reports'] as Feature[],
  PHASE_4: ['school', 'facilities', 'inventory', 'vnftf_integration'] as Feature[],
};

// Hook for checking if a feature is enabled
export function useFeature(feature: Feature): boolean {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        const response = await api.get<{ enabled: boolean }>(`/features/${feature}`);
        if (response.success && response.data) {
          setIsEnabled(response.data.enabled);
        }
      } catch {
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeature();
  }, [feature]);

  return isEnabled;
}

// Hook for getting all enabled features
export function useEnabledFeatures(): {
  features: Feature[];
  isLoading: boolean;
  refetch: () => Promise<void>;
} {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeatures = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Feature[]>('/features');
      if (response.success && response.data) {
        setFeatures(response.data);
      }
    } catch {
      setFeatures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return { features, isLoading, refetch: fetchFeatures };
}

// Hook for checking if a phase is enabled
export function usePhase(phase: keyof typeof PHASES): boolean {
  const { features, isLoading } = useEnabledFeatures();
  const phaseFeatures = PHASES[phase];

  if (isLoading) return false;

  // Phase is enabled if all its features are enabled
  return phaseFeatures.every((feature) => features.includes(feature));
}

// Component wrapper for feature-gated content
interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Component wrapper for phase-gated content
interface PhaseGateProps {
  phase: keyof typeof PHASES;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PhaseGate({ phase, children, fallback = null }: PhaseGateProps) {
  const isEnabled = usePhase(phase);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
