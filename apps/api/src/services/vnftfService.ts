import { PrismaClient } from '@lftcm/database';
import { logger } from '../lib/logger';
import { AppError } from '../middleware/errorHandler';
import crypto from 'crypto';

const prisma = new PrismaClient();

// VNFTF API Configuration
const VNFTF_CONFIG = {
  apiUrl: process.env.VNFTF_API_URL || 'https://api.vnftf.org',
  apiKey: process.env.VNFTF_API_KEY || '',
  webhookSecret: process.env.VNFTF_WEBHOOK_SECRET || '',
};

// Webhook event types from VNFTF
export interface VNFTFWebhookEvent {
  id: string;
  type: 'voice_note.published' | 'voice_note.updated' | 'subscriber.created' | 'subscriber.cancelled' | 'analytics.daily';
  timestamp: string;
  data: any;
  signature: string;
}

export interface VoiceNoteData {
  id: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration: number;
  scripture?: string[];
  publishedAt: string;
  thumbnailUrl?: string;
}

export interface SubscriberData {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  subscribedAt: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'cancelled' | 'paused';
}

// Verify VNFTF webhook signature
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!VNFTF_CONFIG.webhookSecret) {
    logger.warn('VNFTF webhook secret not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', VNFTF_CONFIG.webhookSecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Handle voice note published event
export async function handleVoiceNotePublished(data: VoiceNoteData): Promise<void> {
  logger.info('VNFTF: Voice note published', { voiceNoteId: data.id });

  try {
    // Check if sermon already exists
    const existingSermon = await prisma.sermon.findFirst({
      where: {
        metadata: {
          path: ['vnftfId'],
          equals: data.id,
        },
      },
    });

    if (existingSermon) {
      logger.info('Sermon already exists for voice note', { sermonId: existingSermon.id });
      return;
    }

    // Create sermon from voice note
    const sermon = await prisma.sermon.create({
      data: {
        title: data.title,
        slug: `vnftf-${data.id}`,
        description: data.description,
        audioUrl: data.audioUrl,
        duration: data.duration,
        scripture: data.scripture || [],
        speaker: 'VNFTF',
        preachedAt: new Date(data.publishedAt),
        thumbnailUrl: data.thumbnailUrl,
        isPublished: true,
        publishedAt: new Date(),
        metadata: {
          vnftfId: data.id,
          source: 'VNFTF',
          syncedAt: new Date().toISOString(),
        },
      },
    });

    logger.info('Sermon created from VNFTF voice note', {
      sermonId: sermon.id,
      voiceNoteId: data.id,
    });
  } catch (error) {
    logger.error('Failed to handle voice note published', { error, data });
    throw new AppError('SYNC_ERROR', 'Failed to sync voice note', 500);
  }
}

// Handle voice note updated event
export async function handleVoiceNoteUpdated(data: VoiceNoteData): Promise<void> {
  logger.info('VNFTF: Voice note updated', { voiceNoteId: data.id });

  try {
    // Find existing sermon
    const sermon = await prisma.sermon.findFirst({
      where: {
        metadata: {
          path: ['vnftfId'],
          equals: data.id,
        },
      },
    });

    if (!sermon) {
      logger.warn('Sermon not found for voice note update', { voiceNoteId: data.id });
      return;
    }

    // Update sermon
    await prisma.sermon.update({
      where: { id: sermon.id },
      data: {
        title: data.title,
        description: data.description,
        audioUrl: data.audioUrl,
        duration: data.duration,
        scripture: data.scripture || [],
        thumbnailUrl: data.thumbnailUrl,
        metadata: {
          ...sermon.metadata as object,
          lastSyncedAt: new Date().toISOString(),
        },
      },
    });

    logger.info('Sermon updated from VNFTF', { sermonId: sermon.id });
  } catch (error) {
    logger.error('Failed to handle voice note update', { error, data });
    throw new AppError('SYNC_ERROR', 'Failed to update voice note', 500);
  }
}

// Handle subscriber created event
export async function handleSubscriberCreated(data: SubscriberData): Promise<void> {
  logger.info('VNFTF: Subscriber created', { subscriberId: data.id });

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // Update user with VNFTF info
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          metadata: {
            ...existingUser.metadata as object,
            vnftfSubscriberId: data.id,
            vnftfPlan: data.plan,
            vnftfStatus: data.status,
          },
        },
      });

      logger.info('Existing user linked to VNFTF subscriber', { userId: existingUser.id });
      return;
    }

    // Create new user for VNFTF subscriber
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.name?.split(' ')[0] || 'VNFTF',
        lastName: data.name?.split(' ').slice(1).join(' ') || 'Subscriber',
        phone: data.phone,
        role: 'MEMBER',
        organizationId: 'vnftf-integration',
        metadata: {
          vnftfSubscriberId: data.id,
          vnftfPlan: data.plan,
          vnftfStatus: data.status,
          source: 'VNFTF',
        },
      },
    });

    logger.info('User created from VNFTF subscriber', { userId: user.id });
  } catch (error) {
    logger.error('Failed to handle subscriber created', { error, data });
    throw new AppError('SYNC_ERROR', 'Failed to sync subscriber', 500);
  }
}

// Handle subscriber cancelled event
export async function handleSubscriberCancelled(data: SubscriberData): Promise<void> {
  logger.info('VNFTF: Subscriber cancelled', { subscriberId: data.id });

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      logger.warn('User not found for cancelled subscriber', { email: data.email });
      return;
    }

    // Update user metadata
    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...user.metadata as object,
          vnftfStatus: 'cancelled',
          vnftfCancelledAt: new Date().toISOString(),
        },
      },
    });

    logger.info('User updated for cancelled VNFTF subscription', { userId: user.id });
  } catch (error) {
    logger.error('Failed to handle subscriber cancelled', { error, data });
    throw new AppError('SYNC_ERROR', 'Failed to update subscriber', 500);
  }
}

// Handle analytics daily report
export async function handleAnalyticsDaily(data: any): Promise<void> {
  logger.info('VNFTF: Daily analytics received', { date: data.date });

  try {
    // Store analytics data
    await prisma.auditLog.create({
      data: {
        action: 'VNFTF_ANALYTICS',
        module: 'VNFTF',
        resource: 'analytics',
        details: data,
        orgId: 'vnftf-integration',
      },
    });

    logger.info('VNFTF analytics logged');
  } catch (error) {
    logger.error('Failed to handle analytics', { error, data });
    throw new AppError('SYNC_ERROR', 'Failed to process analytics', 500);
  }
}

// Fetch voice notes from VNFTF API
export async function syncVoiceNotesFromVNFTF(): Promise<number> {
  try {
    const response = await fetch(`${VNFTF_CONFIG.apiUrl}/v1/voice-notes`, {
      headers: {
        Authorization: `Bearer ${VNFTF_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`VNFTF API error: ${response.status}`);
    }

    const voiceNotes: VoiceNoteData[] = await response.json();

    let syncedCount = 0;
    for (const voiceNote of voiceNotes) {
      const existing = await prisma.sermon.findFirst({
        where: {
          metadata: {
            path: ['vnftfId'],
            equals: voiceNote.id,
          },
        },
      });

      if (!existing) {
        await handleVoiceNotePublished(voiceNote);
        syncedCount++;
      }
    }

    logger.info('Voice notes sync completed', { synced: syncedCount, total: voiceNotes.length });
    return syncedCount;
  } catch (error) {
    logger.error('Failed to sync voice notes from VNFTF', { error });
    throw new AppError('SYNC_ERROR', 'Failed to fetch voice notes', 500);
  }
}

// Get VNFTF stats
export async function getVNFTFStats(): Promise<{
  totalSubscribers: number;
  activeSubscribers: number;
  totalVoiceNotes: number;
  syncedVoiceNotes: number;
}> {
  try {
    const [
      vnftfSubscribers,
      vnftfActive,
      totalVoiceNotes,
      syncedVoiceNotes,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          metadata: {
            path: ['vnftfSubscriberId'],
            not: null,
          },
        },
      }),
      prisma.user.count({
        where: {
          metadata: {
            path: ['vnftfStatus'],
            equals: 'active',
          },
        },
      }),
      // This would ideally come from VNFTF API
      Promise.resolve(0),
      prisma.sermon.count({
        where: {
          metadata: {
            path: ['source'],
            equals: 'VNFTF',
          },
        },
      }),
    ]);

    return {
      totalSubscribers: vnftfSubscribers,
      activeSubscribers: vnftfActive,
      totalVoiceNotes,
      syncedVoiceNotes,
    };
  } catch (error) {
    logger.error('Failed to get VNFTF stats', { error });
    throw new AppError('SYNC_ERROR', 'Failed to get stats', 500);
  }
}
