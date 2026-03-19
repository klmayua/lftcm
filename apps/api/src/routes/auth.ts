import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@lftcm/database';
import { config } from '../lib/config';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  branchId: z.string().uuid(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

// Generate tokens
const generateTokens = (user: {
  id: string;
  email: string;
  role: string;
  orgId: string;
}) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, orgId: user.orgId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// Login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          orgId: user.organizationId,
          orgName: user.organization.name,
        },
        ...tokens,
      },
    });
  })
);

// Register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phone, branchId } = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email already registered' },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get branch's organization
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { organization: true },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        error: { code: 'BRANCH_NOT_FOUND', message: 'Branch not found' },
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role: 'MEMBER',
        organizationId: branch.organizationId,
        branchId,
      },
      include: { organization: true },
    });

    // Create member record
    await prisma.member.create({
      data: {
        userId: user.id,
        organizationId: branch.organizationId,
        branchId,
        status: 'ACTIVE',
        membershipType: 'REGULAR',
      },
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          orgId: user.organizationId,
          orgName: user.organization.name,
        },
        ...tokens,
      },
    });
  })
);

// Refresh token
router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = refreshSchema.parse(req.body);

    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { organization: true },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' },
        });
      }

      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.organizationId,
      });

      res.json({
        success: true,
        data: tokens,
      });
    } catch {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' },
      });
    }
  })
);

// Get current user
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: any, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: true,
        branch: true,
        member: {
          include: {
            departmentMemberships: { include: { department: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        orgId: user.organizationId,
        orgName: user.organization.name,
        branchId: user.branchId,
        branchName: user.branch?.name,
        memberId: user.member?.id,
        departments: user.member?.departmentMemberships.map((d) => ({
          id: d.department.id,
          name: d.department.name,
          role: d.role,
        })),
      },
    });
  })
);

// Logout (client should discard tokens)
router.post('/logout', authenticate, asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
}));

export { router as authRouter };
