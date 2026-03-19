import { Router } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import * as vnftfService from '../services/vnftfService';
import { logger } from '../lib/logger';

const router = Router();

// Public webhook endpoint (no auth - uses signature verification)
router.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-vnftf-signature'] as string;

    // Verify webhook signature
    if (!vnftfService.verifyWebhookSignature(payload, signature)) {
      logger.warn('Invalid VNFTF webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    try {
      switch (event.type) {
        case 'voice_note.published':
          await vnftfService.handleVoiceNotePublished(event.data);
          break;
        case 'voice_note.updated':
          await vnftfService.handleVoiceNoteUpdated(event.data);
          break;
        case 'subscriber.created':
          await vnftfService.handleSubscriberCreated(event.data);
          break;
        case 'subscriber.cancelled':
          await vnftfService.handleSubscriberCancelled(event.data);
          break;
        case 'analytics.daily':
          await vnftfService.handleAnalyticsDaily(event.data);
          break;
        default:
          logger.info('Unhandled VNFTF webhook event', { type: event.type });
      }

      res.status(200).json({ received: true });
    } catch (error) {
      logger.error('Error processing VNFTF webhook', { error, event });
      res.status(500).json({ error: 'Processing failed' });
    }
  })
);

// Protected routes
router.use(authenticate);

// List linked VNFTF accounts
router.get(
  '/accounts',
  asyncHandler(async (req: AuthRequest, res) => {
    // Get users with VNFTF integration
    const { PrismaClient } = await import('@lftcm/database');
    const prisma = new PrismaClient();

    const accounts = await prisma.user.findMany({
      where: {
        metadata: {
          path: ['vnftfSubscriberId'],
          not: null,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        metadata: true,
      },
    });

    res.json({
      success: true,
      data: accounts.map((acc) => ({
        id: acc.id,
        email: acc.email,
        name: `${acc.firstName} ${acc.lastName}`,
        vnftfId: (acc.metadata as any)?.vnftfSubscriberId,
        plan: (acc.metadata as any)?.vnftfPlan,
        status: (acc.metadata as any)?.vnftfStatus,
      })),
    });
  })
);

// Link VNFTF account
router.post(
  '/link',
  asyncHandler(async (req: AuthRequest, res) => {
    const { subscriberId } = req.body;

    // TODO: Verify subscriberId with VNFTF API

    res.json({
      success: true,
      message: 'VNFTF account linked',
    });
  })
);

// Sync data from VNFTF
router.post(
  '/sync',
  requireRole(['ADMIN', 'SUPER_ADMIN']),
  asyncHandler(async (_req, res) => {
    const syncedCount = await vnftfService.syncVoiceNotesFromVNFTF();

    res.json({
      success: true,
      data: {
        synced: syncedCount,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// Get VNFTF stats
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const stats = await vnftfService.getVNFTFStats();

    res.json({
      success: true,
      data: stats,
    });
  })
);

export { router as vnftfRouter };
