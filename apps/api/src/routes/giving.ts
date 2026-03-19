import { Router } from 'express';
import { z } from 'zod';
import { DonationType, PaymentStatus } from '@lftcm/database';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import * as paymentService from '../services/paymentService';
import { PrismaClient } from '@lftcm/database';

const prisma = new PrismaClient();
const router = Router();

// Validation schemas
const initiatePaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('XAF'),
  phoneNumber: z.string().min(9).optional(),
  provider: z.enum(['MTN', 'ORANGE', 'PAYSTACK']),
  description: z.string().optional(),
  donationType: z.enum(['TITHE', 'OFFERING', 'PROJECT', 'MISSIONS', 'BUILDING_FUND', 'CHARITY', 'OTHER']),
  projectId: z.string().uuid().optional(),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  callbackUrl: z.string().url().optional(),
  channels: z.array(z.string()).optional(),
});

const verifyPaymentSchema = z.object({
  transactionId: z.string(),
  provider: z.enum(['MTN', 'ORANGE', 'PAYSTACK']),
});

// Public endpoint - initiate payment (can be anonymous)
router.post(
  '/pay',
  asyncHandler(async (req: AuthRequest, res) => {
    const data = initiatePaymentSchema.parse(req.body);

    const response = await paymentService.initiatePayment({
      amount: data.amount,
      currency: data.currency,
      phoneNumber: data.phoneNumber,
      provider: data.provider,
      description: data.description || `${data.donationType} donation`,
      donationType: data.donationType as DonationType,
      projectId: data.projectId,
      userId: req.user?.id,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      callbackUrl: data.callbackUrl,
      channels: data.channels,
    });

    res.json({
      success: true,
      data: response,
    });
  })
);

// Verify payment status
router.post(
  '/verify',
  asyncHandler(async (req, res) => {
    const { transactionId, provider } = verifyPaymentSchema.parse(req.body);

    const status = await paymentService.verifyPayment(transactionId, provider);

    res.json({
      success: true,
      data: { transactionId, status },
    });
  })
);

// MTN Webhook (public - secured by signature verification)
router.post(
  '/webhook/mtn',
  asyncHandler(async (req, res) => {
    // TODO: Verify webhook signature
    await paymentService.handleMTNWebhook(req.body);
    res.status(200).send();
  })
);

// Orange Webhook (public - secured by signature verification)
router.post(
  '/webhook/orange',
  asyncHandler(async (req, res) => {
    // TODO: Verify webhook signature
    await paymentService.handleOrangeWebhook(req.body);
    res.status(200).send();
  })
);

// Paystack Webhook (public - secured by signature verification)
router.post(
  '/webhook/paystack',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-paystack-signature'] as string;
    await paymentService.handlePaystackWebhook(req.body, signature);
    res.status(200).send();
  })
);

// Protected routes below
router.use(authenticate);

// List giving records (admin/finance only)
router.get(
  '/',
  requireRole(['ADMIN', 'FINANCE', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as PaymentStatus | undefined;

    const where: any = {};
    if (status) where.paymentStatus = status;

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          project: {
            select: { id: true, name: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.donation.count({ where }),
    ]);

    res.json({
      success: true,
      data: donations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  })
);

// Get giving record by ID
router.get(
  '/:id',
  requireRole(['ADMIN', 'FINANCE', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req, res) => {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        project: true,
      },
    });

    if (!donation) {
      throw new AppError('NOT_FOUND', 'Donation record not found', 404);
    }

    res.json({
      success: true,
      data: donation,
    });
  })
);

// Create manual giving record (for cash/bank payments)
router.post(
  '/',
  requireRole(['ADMIN', 'FINANCE', 'SECRETARY', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    const data = initiatePaymentSchema.parse(req.body);

    const donation = await prisma.donation.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        donationType: data.donationType as DonationType,
        paymentMethod: 'CASH',
        paymentStatus: PaymentStatus.COMPLETED,
        userId: req.user?.id,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        projectId: data.projectId,
      },
    });

    res.status(201).json({
      success: true,
      data: donation,
    });
  })
);

// Get giving statistics
router.get(
  '/stats/summary',
  requireRole(['ADMIN', 'FINANCE', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await paymentService.getPaymentStats(
      req.user?.orgId || '',
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: stats,
    });
  })
);

// Get my giving history (for current user)
router.get(
  '/my-history',
  asyncHandler(async (req: AuthRequest, res) => {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const donations = await prisma.donation.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { donorEmail: req.user.email },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: donations,
    });
  })
);

// Generate receipt for a donation
router.post(
  '/:id/receipt',
  asyncHandler(async (req: AuthRequest, res) => {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
    });

    if (!donation) {
      throw new AppError('NOT_FOUND', 'Donation not found', 404);
    }

    // Check if user owns this donation or is admin
    if (donation.userId !== req.user?.id &&
        donation.donorEmail !== req.user?.email &&
        !['ADMIN', 'FINANCE', 'SUPER_ADMIN'].includes(req.user?.role || '')) {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    if (donation.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new AppError('INVALID_STATUS', 'Receipt only available for completed payments', 400);
    }

    // Generate receipt number if not exists
    let receiptNumber = donation.receiptNumber;
    if (!receiptNumber) {
      const year = new Date().getFullYear();
      const count = await prisma.donation.count({
        where: {
          receiptNumber: { startsWith: `REC-${year}` },
        },
      });
      receiptNumber = `REC-${year}-${(count + 1).toString().padStart(6, '0')}`;

      await prisma.donation.update({
        where: { id: donation.id },
        data: { receiptNumber },
      });
    }

    res.json({
      success: true,
      data: {
        receiptNumber,
        donation,
        generatedAt: new Date().toISOString(),
      },
    });
  })
);

export { router as givingRouter };
