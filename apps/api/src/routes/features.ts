import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import {
  getEnabledFeatures,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  enablePhase,
  getFeatureConfig,
  FEATURES,
  PHASES,
} from '../middleware/featureFlags';
import { logger } from '../lib/logger';

const router = Router();

router.use(authenticate);

// Get all enabled features for current organization
router.get(
  '/',
  asyncHandler(async (req: any, res) => {
    const features = await getEnabledFeatures(req.user.orgId);

    res.json({
      success: true,
      data: features,
    });
  })
);

// Check if a specific feature is enabled
router.get(
  '/:feature',
  asyncHandler(async (req: any, res) => {
    const { feature } = req.params;
    const isEnabled = await isFeatureEnabled(req.user.orgId, feature);

    res.json({
      success: true,
      data: { enabled: isEnabled },
    });
  })
);

// Get feature configuration
router.get(
  '/:feature/config',
  asyncHandler(async (req: any, res) => {
    const { feature } = req.params;
    const config = await getFeatureConfig(req.user.orgId, feature);

    res.json({
      success: true,
      data: config,
    });
  })
);

// Admin routes
router.use(requireRole(['ADMIN', 'SUPER_ADMIN']));

// Enable a feature
router.post(
  '/:feature/enable',
  asyncHandler(async (req: any, res) => {
    const { feature } = req.params;
    const config = req.body.config || {};

    await enableFeature(req.user.orgId, feature, config);

    logger.info('Feature enabled via API', {
      orgId: req.user.orgId,
      feature,
      by: req.user.id,
    });

    res.json({
      success: true,
      message: `Feature '${feature}' enabled`,
    });
  })
);

// Disable a feature
router.post(
  '/:feature/disable',
  asyncHandler(async (req: any, res) => {
    const { feature } = req.params;

    await disableFeature(req.user.orgId, feature);

    logger.info('Feature disabled via API', {
      orgId: req.user.orgId,
      feature,
      by: req.user.id,
    });

    res.json({
      success: true,
      message: `Feature '${feature}' disabled`,
    });
  })
);

// Enable all features in a phase
router.post(
  '/phases/:phase/enable',
  asyncHandler(async (req: any, res) => {
    const { phase } = req.params;

    if (!PHASES[phase as keyof typeof PHASES]) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PHASE',
          message: `Phase '${phase}' does not exist`,
        },
      });
    }

    await enablePhase(req.user.orgId, phase as keyof typeof PHASES);

    logger.info('Phase enabled via API', {
      orgId: req.user.orgId,
      phase,
      by: req.user.id,
    });

    res.json({
      success: true,
      message: `Phase '${phase}' enabled`,
    });
  })
);

// Get all available features
router.get(
  '/admin/all',
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: {
        features: Object.values(FEATURES),
        phases: Object.keys(PHASES),
        phaseFeatures: PHASES,
      },
    });
  })
);

export { router as featuresRouter };
