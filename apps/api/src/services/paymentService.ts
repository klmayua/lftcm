import { PrismaClient, PaymentStatus, DonationType } from '@lftcm/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../lib/logger';
import { config } from '../lib/config';
import axios from 'axios';

const prisma = new PrismaClient();

// MTN Mobile Money API Configuration
const MTN_MOMO_CONFIG = {
  baseUrl: process.env.MTN_MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com',
  apiUser: process.env.MTN_MOMO_API_USER || '',
  apiKey: process.env.MTN_MOMO_API_KEY || '',
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
  targetEnvironment: process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
};

// Orange Money API Configuration
const ORANGE_MONEY_CONFIG = {
  baseUrl: process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com',
  clientId: process.env.ORANGE_MONEY_CLIENT_ID || '',
  clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET || '',
  merchantNumber: process.env.ORANGE_MONEY_MERCHANT_NUMBER || '',
};

// Paystack Configuration
const PAYSTACK_CONFIG = {
  baseUrl: config.paystackBaseUrl,
  secretKey: config.paystackSecretKey,
  publicKey: config.paystackPublicKey,
};

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber?: string;
  provider: 'MTN' | 'ORANGE' | 'PAYSTACK';
  description: string;
  donationType: DonationType;
  projectId?: string;
  userId?: string;
  donorName?: string;
  donorEmail?: string;
  metadata?: Record<string, unknown>;
  // Paystack specific fields
  callbackUrl?: string;
  channels?: string[]; // ['card', 'bank', 'ussd', 'mobile_money']
}

export interface PaymentResponse {
  transactionId: string;
  reference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  provider: string;
  phoneNumber?: string;
  message: string;
  // Paystack specific
  authorizationUrl?: string;
  accessCode?: string;
}

// Generate unique transaction reference
function generateReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LFT-${timestamp}-${random}`;
}

// Format phone number for Cameroon
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');

  // Remove leading 237 if present
  if (cleaned.startsWith('237')) {
    cleaned = cleaned.substring(3);
  }

  // Remove leading 0
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add country code
  return `237${cleaned}`;
}

// Validate phone number for Cameroon
function validatePhoneNumber(phone: string, provider: 'MTN' | 'ORANGE'): boolean {
  const formatted = formatPhoneNumber(phone);

  // MTN numbers: 67, 68, 69
  // Orange numbers: 65, 66, 69
  const mtnPrefixes = ['67', '68', '69'];
  const orangePrefixes = ['65', '66', '69'];

  const prefix = formatted.substring(3, 5);

  if (provider === 'MTN') {
    return mtnPrefixes.includes(prefix);
  } else {
    return orangePrefixes.includes(prefix);
  }
}

// Get MTN MoMo access token
async function getMTNAccessToken(): Promise<string> {
  try {
    const authString = Buffer.from(
      `${MTN_MOMO_CONFIG.apiUser}:${MTN_MOMO_CONFIG.apiKey}`
    ).toString('base64');

    const response = await axios.post(
      `${MTN_MOMO_CONFIG.baseUrl}/collection/token/`,
      {},
      {
        headers: {
          Authorization: `Basic ${authString}`,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.subscriptionKey,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    logger.error('Failed to get MTN access token', { error });
    throw new AppError('PAYMENT_ERROR', 'Failed to initialize payment provider', 500);
  }
}

// Get Orange Money access token
async function getOrangeAccessToken(): Promise<string> {
  try {
    const authString = Buffer.from(
      `${ORANGE_MONEY_CONFIG.clientId}:${ORANGE_MONEY_CONFIG.clientSecret}`
    ).toString('base64');

    const response = await axios.post(
      `${ORANGE_MONEY_CONFIG.baseUrl}/oauth/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    logger.error('Failed to get Orange access token', { error });
    throw new AppError('PAYMENT_ERROR', 'Failed to initialize payment provider', 500);
  }
}

// Initiate MTN Mobile Money payment
async function initiateMTNPayment(
  request: PaymentRequest,
  reference: string
): Promise<PaymentResponse> {
  const token = await getMTNAccessToken();
  const formattedPhone = formatPhoneNumber(request.phoneNumber);

  const externalId = reference.replace(/-/g, '');

  try {
    const response = await axios.post(
      `${MTN_MOMO_CONFIG.baseUrl}/collection/v1_0/requesttopay`,
      {
        amount: request.amount.toString(),
        currency: request.currency,
        externalId: externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: request.description,
        payeeNote: `LFTCM Donation - ${reference}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Reference-Id': externalId,
          'X-Target-Environment': MTN_MOMO_CONFIG.targetEnvironment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.subscriptionKey,
          'Content-Type': 'application/json',
        },
      }
    );

    // MTN returns 202 Accepted - payment is pending
    return {
      transactionId: externalId,
      reference,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      provider: 'MTN',
      phoneNumber: formattedPhone,
      message: 'Payment request sent. Please confirm on your phone.',
    };
  } catch (error: any) {
    logger.error('MTN payment initiation failed', {
      error: error.response?.data || error.message,
      reference,
    });
    throw new AppError(
      'PAYMENT_FAILED',
      error.response?.data?.message || 'Failed to initiate MTN payment',
      500
    );
  }
}

// Initiate Orange Money payment
async function initiateOrangePayment(
  request: PaymentRequest,
  reference: string
): Promise<PaymentResponse> {
  const token = await getOrangeAccessToken();
  const formattedPhone = formatPhoneNumber(request.phoneNumber);

  try {
    // Orange Money uses a different API structure
    const response = await axios.post(
      `${ORANGE_MONEY_CONFIG.baseUrl}/orange-money-webpay/dev/v1/payment`,
      {
        merchant_number: ORANGE_MONEY_CONFIG.merchantNumber,
        merchant_name: 'Living Faith Tabernacle',
        amount: request.amount,
        currency: request.currency,
        reference: reference,
        customer_number: formattedPhone,
        customer_email: request.donorEmail || '',
        customer_name: request.donorName || 'Anonymous',
        description: request.description,
        return_url: `${process.env.APP_URL}/giving/verify`,
        cancel_url: `${process.env.APP_URL}/giving/cancel`,
        notif_url: `${process.env.API_URL}/api/giving/webhook/orange`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      transactionId: response.data.payment_id || reference,
      reference,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      provider: 'ORANGE',
      phoneNumber: formattedPhone,
      message: 'Payment initiated. Please complete on Orange Money.',
    };
  } catch (error: any) {
    logger.error('Orange payment initiation failed', {
      error: error.response?.data || error.message,
      reference,
    });
    throw new AppError(
      'PAYMENT_FAILED',
      error.response?.data?.message || 'Failed to initiate Orange Money payment',
      500
    );
  }
}

// ==================== PAYSTACK IMPLEMENTATION ====================

// Initiate Paystack payment (for international/card payments)
async function initiatePaystackPayment(
  request: PaymentRequest,
  reference: string
): Promise<PaymentResponse> {
  if (!PAYSTACK_CONFIG.secretKey) {
    throw new AppError(
      'PAYMENT_CONFIG_ERROR',
      'Paystack is not configured. Please contact support.',
      500
    );
  }

  // Paystack amount is in kobo (smallest currency unit)
  // For XAF, we use the base amount as-is since there's no smaller unit in the API
  const amountInSmallestUnit = request.currency === 'NGN'
    ? request.amount * 100  // NGN uses kobo
    : request.amount;

  try {
    const response = await axios.post(
      `${PAYSTACK_CONFIG.baseUrl}/transaction/initialize`,
      {
        email: request.donorEmail || 'donor@lftcm.org',
        amount: amountInSmallestUnit,
        currency: request.currency,
        reference: reference,
        callback_url: request.callbackUrl || `${process.env.APP_URL}/giving/verify`,
        metadata: {
          donor_name: request.donorName || 'Anonymous',
          donation_type: request.donationType,
          project_id: request.projectId,
          custom_fields: [
            {
              display_name: 'Donation Type',
              variable_name: 'donation_type',
              value: request.donationType,
            },
            {
              display_name: 'Donor Name',
              variable_name: 'donor_name',
              value: request.donorName || 'Anonymous',
            },
          ],
        },
        channels: request.channels || ['card', 'bank', 'ussd', 'mobile_money'],
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data;

    return {
      transactionId: reference,
      reference,
      status: PaymentStatus.PENDING,
      amount: request.amount,
      currency: request.currency,
      provider: 'PAYSTACK',
      message: 'Payment initialized. Please complete the payment.',
      authorizationUrl: data.authorization_url,
      accessCode: data.access_code,
    };
  } catch (error: any) {
    logger.error('Paystack payment initiation failed', {
      error: error.response?.data || error.message,
      reference,
    });
    throw new AppError(
      'PAYMENT_FAILED',
      error.response?.data?.message || 'Failed to initialize Paystack payment',
      500
    );
  }
}

// Verify Paystack payment
async function checkPaystackStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const response = await axios.get(
      `${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === 'success') {
      return PaymentStatus.COMPLETED;
    } else if (data.status === 'failed' || data.status === 'abandoned') {
      return PaymentStatus.FAILED;
    } else {
      return PaymentStatus.PENDING;
    }
  } catch (error) {
    logger.error('Failed to verify Paystack payment', { error, transactionId });
    return PaymentStatus.PENDING;
  }
}

// Handle Paystack webhook
export async function handlePaystackWebhook(payload: any, signature: string): Promise<void> {
  // Verify webhook signature
  const crypto = await import('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_CONFIG.secretKey)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (hash !== signature) {
    logger.error('Paystack webhook signature verification failed');
    throw new AppError('INVALID_SIGNATURE', 'Invalid webhook signature', 401);
  }

  const event = payload.event;
  const data = payload.data;

  // Find donation by reference
  const donation = await prisma.donation.findFirst({
    where: { transactionId: data.reference },
  });

  if (!donation) {
    logger.error('Paystack webhook: Donation not found', { reference: data.reference });
    return;
  }

  let paymentStatus: PaymentStatus;

  switch (event) {
    case 'charge.success':
      paymentStatus = PaymentStatus.COMPLETED;
      break;
    case 'charge.failed':
    case 'charge.reversed':
      paymentStatus = PaymentStatus.FAILED;
      break;
    default:
      logger.info('Paystack webhook: Unhandled event', { event });
      return;
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: {
      paymentStatus,
      metadata: {
        ...donation.metadata as object,
        paystackTransactionId: data.id,
        paystackTransactionDate: data.paid_at,
        paystackChannel: data.channel,
        paystackCardType: data.authorization?.card_type,
        paystackBank: data.authorization?.bank,
        paystackCountryCode: data.authorization?.country_code,
        webhookReceivedAt: new Date().toISOString(),
      },
    },
  });

  logger.info('Paystack webhook processed', {
    reference: data.reference,
    event,
    transactionId: data.id,
  });
}

// Main payment initiation function
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Validate phone number for mobile money providers
  if (request.provider !== 'PAYSTACK' && request.phoneNumber) {
    if (!validatePhoneNumber(request.phoneNumber, request.provider)) {
      throw new AppError(
        'INVALID_PHONE',
        `Invalid phone number for ${request.provider}. Please check and try again.`,
        400
      );
    }
  }

  // Generate reference
  const reference = generateReference();

  // Determine payment method for database
  let paymentMethod: string;
  switch (request.provider) {
    case 'MTN':
      paymentMethod = 'MTN_MOBILE_MONEY';
      break;
    case 'ORANGE':
      paymentMethod = 'ORANGE_MONEY';
      break;
    case 'PAYSTACK':
      paymentMethod = 'PAYSTACK';
      break;
    default:
      paymentMethod = 'UNKNOWN';
  }

  // Create donation record in database
  await prisma.donation.create({
    data: {
      amount: request.amount,
      currency: request.currency,
      donationType: request.donationType,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      transactionId: reference,
      userId: request.userId,
      donorName: request.donorName,
      donorEmail: request.donorEmail,
      projectId: request.projectId,
      metadata: request.metadata || {},
    },
  });

  // Initiate payment based on provider
  let response: PaymentResponse;

  switch (request.provider) {
    case 'MTN':
      response = await initiateMTNPayment(request, reference);
      break;
    case 'ORANGE':
      response = await initiateOrangePayment(request, reference);
      break;
    case 'PAYSTACK':
      response = await initiatePaystackPayment(request, reference);
      break;
    default:
      throw new AppError('INVALID_PROVIDER', 'Invalid payment provider', 400);
  }

  logger.info('Payment initiated', {
    reference,
    provider: request.provider,
    amount: request.amount,
    phone: request.phoneNumber ? formatPhoneNumber(request.phoneNumber) : 'N/A',
  });

  return response;
}

// Check MTN payment status
async function checkMTNStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const token = await getMTNAccessToken();
    const externalId = transactionId.replace(/-/g, '');

    const response = await axios.get(
      `${MTN_MOMO_CONFIG.baseUrl}/collection/v1_0/requesttopay/${externalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Target-Environment': MTN_MOMO_CONFIG.targetEnvironment,
          'Ocp-Apim-Subscription-Key': MTN_MOMO_CONFIG.subscriptionKey,
        },
      }
    );

    const status = response.data.status;

    switch (status) {
      case 'SUCCESSFUL':
        return PaymentStatus.COMPLETED;
      case 'FAILED':
        return PaymentStatus.FAILED;
      case 'PENDING':
        return PaymentStatus.PENDING;
      default:
        return PaymentStatus.PENDING;
    }
  } catch (error) {
    logger.error('Failed to check MTN payment status', { error, transactionId });
    return PaymentStatus.PENDING;
  }
}

// Check Orange payment status
async function checkOrangeStatus(transactionId: string): Promise<PaymentStatus> {
  try {
    const token = await getOrangeAccessToken();

    const response = await axios.get(
      `${ORANGE_MONEY_CONFIG.baseUrl}/orange-money-webpay/dev/v1/payment/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const status = response.data.status;

    switch (status) {
      case 'SUCCESS':
        return PaymentStatus.COMPLETED;
      case 'FAILED':
      case 'CANCELLED':
        return PaymentStatus.FAILED;
      case 'PENDING':
      case 'INITIATED':
        return PaymentStatus.PENDING;
      default:
        return PaymentStatus.PENDING;
    }
  } catch (error) {
    logger.error('Failed to check Orange payment status', { error, transactionId });
    return PaymentStatus.PENDING;
  }
}

// Verify payment status
export async function verifyPayment(
  transactionId: string,
  provider: 'MTN' | 'ORANGE' | 'PAYSTACK'
): Promise<PaymentStatus> {
  const donation = await prisma.donation.findFirst({
    where: { transactionId },
  });

  if (!donation) {
    throw new AppError('NOT_FOUND', 'Transaction not found', 404);
  }

  // If already completed or failed, return current status
  if (donation.paymentStatus === PaymentStatus.COMPLETED ||
      donation.paymentStatus === PaymentStatus.FAILED) {
    return donation.paymentStatus;
  }

  // Check with provider
  let newStatus: PaymentStatus;

  switch (provider) {
    case 'MTN':
      newStatus = await checkMTNStatus(transactionId);
      break;
    case 'ORANGE':
      newStatus = await checkOrangeStatus(transactionId);
      break;
    case 'PAYSTACK':
      newStatus = await checkPaystackStatus(transactionId);
      break;
    default:
      newStatus = donation.paymentStatus;
  }

  // Update database if status changed
  if (newStatus !== donation.paymentStatus) {
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paymentStatus: newStatus },
    });

    logger.info('Payment status updated', {
      transactionId,
      oldStatus: donation.paymentStatus,
      newStatus,
    });
  }

  return newStatus;
}

// Handle MTN webhook
export async function handleMTNWebhook(payload: any): Promise<void> {
  const { referenceId, status, financialTransactionId } = payload;

  const donation = await prisma.donation.findFirst({
    where: { transactionId: referenceId },
  });

  if (!donation) {
    logger.error('Webhook: Donation not found', { referenceId });
    return;
  }

  let paymentStatus: PaymentStatus;

  switch (status) {
    case 'SUCCESSFUL':
      paymentStatus = PaymentStatus.COMPLETED;
      break;
    case 'FAILED':
      paymentStatus = PaymentStatus.FAILED;
      break;
    default:
      paymentStatus = PaymentStatus.PENDING;
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: {
      paymentStatus,
      metadata: {
        ...donation.metadata as object,
        financialTransactionId,
        webhookReceivedAt: new Date().toISOString(),
      },
    },
  });

  logger.info('MTN webhook processed', { referenceId, status, financialTransactionId });
}

// Handle Orange webhook
export async function handleOrangeWebhook(payload: any): Promise<void> {
  const { payment_id, status, transaction_id } = payload;

  const donation = await prisma.donation.findFirst({
    where: { transactionId: payment_id },
  });

  if (!donation) {
    logger.error('Webhook: Donation not found', { payment_id });
    return;
  }

  let paymentStatus: PaymentStatus;

  switch (status) {
    case 'SUCCESS':
      paymentStatus = PaymentStatus.COMPLETED;
      break;
    case 'FAILED':
    case 'CANCELLED':
      paymentStatus = PaymentStatus.FAILED;
      break;
    default:
      paymentStatus = PaymentStatus.PENDING;
  }

  await prisma.donation.update({
    where: { id: donation.id },
    data: {
      paymentStatus,
      metadata: {
        ...donation.metadata as object,
        orangeTransactionId: transaction_id,
        webhookReceivedAt: new Date().toISOString(),
      },
    },
  });

  logger.info('Orange webhook processed', { payment_id, status, transaction_id });
}

// Get payment statistics
export async function getPaymentStats(
  organizationId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = {};

  if (startDate && endDate) {
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  const [
    totalDonations,
    completedDonations,
    pendingDonations,
    failedDonations,
    totalAmount,
    byType,
    byMethod,
  ] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.count({ where: { ...where, paymentStatus: PaymentStatus.COMPLETED } }),
    prisma.donation.count({ where: { ...where, paymentStatus: PaymentStatus.PENDING } }),
    prisma.donation.count({ where: { ...where, paymentStatus: PaymentStatus.FAILED } }),
    prisma.donation.aggregate({
      where: { ...where, paymentStatus: PaymentStatus.COMPLETED },
      _sum: { amount: true },
    }),
    prisma.donation.groupBy({
      by: ['donationType'],
      where: { ...where, paymentStatus: PaymentStatus.COMPLETED },
      _sum: { amount: true },
      _count: { donationType: true },
    }),
    prisma.donation.groupBy({
      by: ['paymentMethod'],
      where: { ...where, paymentStatus: PaymentStatus.COMPLETED },
      _sum: { amount: true },
      _count: { paymentMethod: true },
    }),
  ]);

  return {
    summary: {
      total: totalDonations,
      completed: completedDonations,
      pending: pendingDonations,
      failed: failedDonations,
      totalAmount: totalAmount._sum.amount?.toString() || '0',
    },
    byType: byType.map((t) => ({
      type: t.donationType,
      amount: t._sum.amount?.toString() || '0',
      count: t._count.donationType,
    })),
    byMethod: byMethod.map((m) => ({
      method: m.paymentMethod,
      amount: m._sum.amount?.toString() || '0',
      count: m._count.paymentMethod,
    })),
  };
}
