import { Router } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Generate VAPID keys (run once: npx web-push generate-vapid-keys)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

// Store subscriptions (in production, use Redis or database)
const subscriptions: any[] = [];

// Get public VAPID key
router.get(
  '/vapid-public-key',
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      publicKey: VAPID_PUBLIC_KEY,
    });
  })
);

// Subscribe to push notifications
router.post(
  '/subscribe',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const subscription = req.body;

    // Add user info to subscription
    const subscriptionWithUser = {
      ...subscription,
      userId: req.user?.id,
      createdAt: new Date(),
    };

    // Store subscription
    const existingIndex = subscriptions.findIndex(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (existingIndex >= 0) {
      subscriptions[existingIndex] = subscriptionWithUser;
    } else {
      subscriptions.push(subscriptionWithUser);
    }

    res.json({
      success: true,
      message: 'Subscribed to push notifications',
    });
  })
);

// Unsubscribe from push notifications
router.post(
  '/unsubscribe',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { endpoint } = req.body;

    const index = subscriptions.findIndex((sub) => sub.endpoint === endpoint);
    if (index >= 0) {
      subscriptions.splice(index, 1);
    }

    res.json({
      success: true,
      message: 'Unsubscribed from push notifications',
    });
  })
);

// Send notification (admin only)
router.post(
  '/send',
  requireRole(['ADMIN', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req, res) => {
    const { title, body, url, userIds } = req.body;

    const notification = {
      title,
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'notification',
      requireInteraction: false,
      data: { url: url || '/' },
    };

    // Filter subscriptions by userIds if provided
    const targetSubscriptions = userIds
      ? subscriptions.filter((sub) => userIds.includes(sub.userId))
      : subscriptions;

    // Send notifications
    const results = await Promise.allSettled(
      targetSubscriptions.map(async (sub) => {
        // In production, use web-push library
        // await webpush.sendNotification(sub, JSON.stringify(notification));
        console.log('Sending notification to:', sub.userId);
        return { success: true };
      })
    );

    const successCount = results.filter(
      (r) => r.status === 'fulfilled'
    ).length;

    res.json({
      success: true,
      data: {
        sent: successCount,
        failed: results.length - successCount,
        total: targetSubscriptions.length,
      },
    });
  })
);

export { router as notificationsRouter };
