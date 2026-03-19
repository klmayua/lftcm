import { Router } from 'express';
import { z } from 'zod';
import { Gender, MaritalStatus, MemberStatus, MembershipType } from '@lftcm/database';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import * as memberService from '../services/memberService';

const router = Router();

// Validation schemas
const createMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  profession: z.string().optional(),
  branchId: z.string().uuid(),
  departmentIds: z.array(z.string().uuid()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  membershipType: z.enum(['REGULAR', 'WORKER', 'MINISTER', 'VISITOR', 'ONLINE']).optional(),
});

const updateMemberSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  profession: z.string().optional(),
  branchId: z.string().uuid().optional(),
  departmentIds: z.array(z.string().uuid()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  membershipType: z.enum(['REGULAR', 'WORKER', 'MINISTER', 'VISITOR', 'ONLINE']).optional(),
});

const listMembersQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  membershipType: z.enum(['REGULAR', 'WORKER', 'MINISTER', 'VISITOR', 'ONLINE']).optional(),
  departmentId: z.string().uuid().optional(),
  search: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  sortBy: z.string().default('joinedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// All routes require authentication
router.use(authenticate);

// List members
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res) => {
    const query = listMembersQuerySchema.parse(req.query);

    const filters = {
      organizationId: req.user!.orgId,
      branchId: req.query.branchId as string | undefined,
      status: query.status,
      membershipType: query.membershipType,
      departmentId: query.departmentId,
      search: query.search,
      gender: query.gender as Gender | undefined,
    };

    const pagination = {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };

    const result = await memberService.listMembers(filters, pagination);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  })
);

// Get member statistics
router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res) => {
    const branchId = req.query.branchId as string | undefined;

    // Check permissions - super admins can see all, others only their branch
    if (req.user!.role !== 'SUPER_ADMIN' && branchId && branchId !== req.user!.orgId) {
      throw new AppError('FORBIDDEN', 'Access denied to this branch', 403);
    }

    const stats = await memberService.getMemberStats(req.user!.orgId, branchId);

    res.json({
      success: true,
      data: stats,
    });
  })
);

// Get member by ID
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res) => {
    const member = await memberService.getMemberById(req.params.id);

    // Check organization access
    if (member.organizationId !== req.user!.orgId && req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    res.json({
      success: true,
      data: member,
    });
  })
);

// Create member
router.post(
  '/',
  requireRole(['ADMIN', 'PASTOR', 'SECRETARY', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    const data = createMemberSchema.parse(req.body);

    // Ensure user can only create members in their org
    const member = await memberService.createMember({
      ...data,
      organizationId: req.user!.orgId,
      branchId: data.branchId,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender as Gender | undefined,
      maritalStatus: data.maritalStatus as MaritalStatus | undefined,
      status: data.status as MemberStatus | undefined,
      membershipType: data.membershipType as MembershipType | undefined,
    });

    res.status(201).json({
      success: true,
      data: member,
    });
  })
);

// Update member
router.patch(
  '/:id',
  requireRole(['ADMIN', 'PASTOR', 'SECRETARY', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    const data = updateMemberSchema.parse(req.body);

    // Check if member exists and belongs to user's org
    const existing = await memberService.getMemberById(req.params.id);
    if (existing.organizationId !== req.user!.orgId && req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    const member = await memberService.updateMember(req.params.id, {
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      gender: data.gender as Gender | undefined,
      maritalStatus: data.maritalStatus as MaritalStatus | undefined,
      status: data.status as MemberStatus | undefined,
      membershipType: data.membershipType as MembershipType | undefined,
    });

    res.json({
      success: true,
      data: member,
    });
  })
);

// Delete member (soft delete)
router.delete(
  '/:id',
  requireRole(['ADMIN', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req: AuthRequest, res) => {
    // Check if member exists and belongs to user's org
    const existing = await memberService.getMemberById(req.params.id);
    if (existing.organizationId !== req.user!.orgId && req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    await memberService.deleteMember(req.params.id);

    res.json({
      success: true,
      message: 'Member deactivated successfully',
    });
  })
);

// Get member attendance history
router.get(
  '/:id/attendance',
  asyncHandler(async (req: AuthRequest, res) => {
    const member = await memberService.getMemberById(req.params.id);

    if (member.organizationId !== req.user!.orgId && req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    const { PrismaClient } = await import('@lftcm/database');
    const prisma = new PrismaClient();

    const attendance = await prisma.attendanceRecord.findMany({
      where: { memberId: req.params.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            type: true,
            eventDate: true,
          },
        },
      },
      orderBy: { eventDate: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: attendance,
    });
  })
);

// Get member giving history
router.get(
  '/:id/giving',
  asyncHandler(async (req: AuthRequest, res) => {
    const member = await memberService.getMemberById(req.params.id);

    if (member.organizationId !== req.user!.orgId && req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('FORBIDDEN', 'Access denied', 403);
    }

    const { PrismaClient } = await import('@lftcm/database');
    const prisma = new PrismaClient();

    const giving = await prisma.givingRecord.findMany({
      where: { memberId: req.params.id },
      orderBy: { givingDate: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: giving,
    });
  })
);

export { router as membersRouter };
