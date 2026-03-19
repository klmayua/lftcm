import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@lftcm/database';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Feature flag definitions
export const FEATURES = {
  // Phase 1: Foundation
  PUBLIC_WEBSITE: 'public_website',
  MEMBER_PROFILES: 'member_profiles',
  SERMONS: 'sermons',
  EVENTS: 'events',

  // Phase 2: Engagement
  ONLINE_GIVING: 'online_giving',
  PRAYER_WALL: 'prayer_wall',
  PUSH_NOTIFICATIONS: 'push_notifications',
  PWA: 'pwa',

  // Phase 3: Operations
  ACCOUNTING: 'accounting',
  PAYROLL: 'payroll',
  ATTENDANCE: 'attendance',
  REPORTS: 'reports',

  // Phase 4: Advanced
  SCHOOL: 'school',
  FACILITIES: 'facilities',
  INVENTORY: 'inventory',
  VNFTF_INTEGRATION: 'vnftf_integration',
} as const;

export type Feature = typeof FEATURES[keyof typeof FEATURES];

// Phase definitions for deployment
export const PHASES = {
  PHASE_1: [
    FEATURES.PUBLIC_WEBSITE,
    FEATURES.MEMBER_PROFILES,
    FEATURES.SERMONS,
    FEATURES.EVENTS,
  ],
  PHASE_2: [
    FEATURES.ONLINE_GIVING,
    FEATURES.PRAYER_WALL,
    FEATURES.PUSH_NOTIFICATIONS,
    FEATURES.PWA,
  ],
  PHASE_3: [
    FEATURES.ACCOUNTING,
    FEATURES.PAYROLL,
    FEATURES.ATTENDANCE,
    FEATURES.REPORTS,
  ],
  PHASE_4: [
    FEATURES.SCHOOL,
    FEATURES.FACILITIES,
    FEATURES.INVENTORY,
    FEATURES.VNFTF_INTEGRATION,
  ],
};

// Check if a feature is enabled for an organization
export async function isFeatureEnabled(
  orgId: string,
  feature: Feature
): Promise<boolean> {
  try {
    // Check if module exists and is active
    const module = await prisma.module.findFirst({
      where: {
        orgId,
        name: feature,
        isActive: true,
      },
    });

    return !!module;
  } catch (error) {
    logger.error('Error checking feature flag', { error, orgId, feature });
    return false;
  }
}

// Get all enabled features for an organization
export async function getEnabledFeatures(orgId: string): Promise<Feature[]> {
  try {
    const modules = await prisma.module.findMany({
      where: {
        orgId,
        isActive: true,
      },
      select: {
        name: true,
      },
    });

    return modules.map((m) => m.name as Feature);
  } catch (error) {
    logger.error('Error getting enabled features', { error, orgId });
    return [];
  }
}

// Middleware to check if a feature is enabled
export function requireFeature(feature: Feature) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const orgId = req.user?.orgId;

    if (!orgId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Organization not found',
        },
      });
    }

    const isEnabled = await isFeatureEnabled(orgId, feature);

    if (!isEnabled) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FEATURE_DISABLED',
          message: `Feature '${feature}' is not enabled for this organization`,
        },
      });
    }

    next();
  };
}

// Enable a feature for an organization
export async function enableFeature(
  orgId: string,
  feature: Feature,
  config: Record<string, unknown> = {}
): Promise<void> {
  try {
    await prisma.module.upsert({
      where: {
        orgId_name: {
          orgId,
          name: feature,
        },
      },
      update: {
        isActive: true,
        config,
      },
      create: {
        orgId,
        name: feature,
        isActive: true,
        isInstalled: true,
        config,
      },
    });

    logger.info('Feature enabled', { orgId, feature });
  } catch (error) {
    logger.error('Error enabling feature', { error, orgId, feature });
    throw error;
  }
}

// Disable a feature for an organization
export async function disableFeature(
  orgId: string,
  feature: Feature
): Promise<void> {
  try {
    await prisma.module.updateMany({
      where: {
        orgId,
        name: feature,
      },
      data: {
        isActive: false,
      },
    });

    logger.info('Feature disabled', { orgId, feature });
  } catch (error) {
    logger.error('Error disabling feature', { error, orgId, feature });
    throw error;
  }
}

// Enable all features for a phase
export async function enablePhase(
  orgId: string,
  phase: keyof typeof PHASES
): Promise<void> {
  const features = PHASES[phase];

  for (const feature of features) {
    await enableFeature(orgId, feature);
  }

  logger.info('Phase enabled', { orgId, phase });
}

// Get feature configuration
export async function getFeatureConfig(
  orgId: string,
  feature: Feature
): Promise<Record<string, unknown> | null> {
  try {
    const module = await prisma.module.findFirst({
      where: {
        orgId,
        name: feature,
        isActive: true,
      },
      select: {
        config: true,
      },
    });

    return module?.config as Record<string, unknown> || null;
  } catch (error) {
    logger.error('Error getting feature config', { error, orgId, feature });
    return null;
  }
}
