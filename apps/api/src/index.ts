import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import crypto from 'crypto';
import { config } from './lib/config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { membersRouter } from './routes/members';
import { sermonsRouter } from './routes/sermons';
import { eventsRouter } from './routes/events';
import { givingRouter } from './routes/giving';
import { prayerRouter } from './routes/prayer';
import { dashboardRouter } from './routes/dashboard';
import { vnftfRouter } from './routes/vnftf';
import { notificationsRouter } from './routes/notifications';
import { featuresRouter } from './routes/features';

const app = express();

// Security middleware - strengthened CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Removed 'unsafe-inline'
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      frameAncestors: ["'none'"], // Prevent clickjacking
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Cookie parser for CSRF
app.use(cookieParser());

// CSRF protection - skip for webhooks
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Webhook rate limiting (separate limits)
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 1 per second average
  message: 'Webhook rate limit exceeded',
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.headers['x-request-id']);
  next();
});

// Health check (no CSRF)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes - webhooks skip CSRF
app.use('/api/vnftf/webhook', webhookLimiter, vnftfRouter);
app.use('/api/giving/webhook', webhookLimiter, givingRouter);

// Protected routes with CSRF
app.use('/api/auth', csrfProtection, authRouter);
app.use('/api/members', csrfProtection, membersRouter);
app.use('/api/sermons', csrfProtection, sermonsRouter);
app.use('/api/events', csrfProtection, eventsRouter);
app.use('/api/giving', csrfProtection, givingRouter);
app.use('/api/prayer', csrfProtection, prayerRouter);
app.use('/api/dashboard', csrfProtection, dashboardRouter);
app.use('/api/vnftf', csrfProtection, vnftfRouter);
app.use('/api/notifications', csrfProtection, notificationsRouter);
app.use('/api/features', csrfProtection, featuresRouter);

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
});

const PORT = config.port || 4000;

app.listen(PORT, () => {
  logger.info(`LFTCM API server running on port ${PORT}`);
});

// Export for testing
export { app };
