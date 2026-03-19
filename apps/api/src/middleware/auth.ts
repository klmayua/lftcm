import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@lftcm/database';
import { config } from '../lib/config';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    orgId: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      role: string;
      orgId: string;
    };

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      orgId: decoded.orgId,
    };

    next();
  } catch (error) {
    logger.warn('Authentication failed', { error });

    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        requiredRoles: roles,
        userRole: req.user.role,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
    }

    next();
  };
};

// Branch isolation middleware - async version
export const requireBranchAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.branchId || req.query.branchId || req.body.branchId;

    if (!branchId) {
      return next(); // No branch specified, use user's default
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    // Super admins can access all branches
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Admins can access branches in their organization
    if (req.user.role === 'ADMIN') {
      const branch = await prisma.branch.findFirst({
        where: {
          id: branchId as string,
          organizationId: req.user.orgId,
        },
      });

      if (!branch) {
        logger.warn('Admin attempted to access branch outside their organization', {
          userId: req.user.id,
          branchId,
          orgId: req.user.orgId,
        });
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied to this branch',
          },
        });
      }
      return next();
    }

    // Regular users must be members of the branch
    const membership = await prisma.member.findFirst({
      where: {
        userId: req.user.id,
        branchId: branchId as string,
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      logger.warn('User attempted to access branch they are not a member of', {
        userId: req.user.id,
        branchId,
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied to this branch',
        },
      });
    }

    next();
  } catch (error) {
    logger.error('Error in branch access check', { error });
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify branch access',
      },
    });
  }
};
