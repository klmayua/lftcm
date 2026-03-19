import { PrismaClient, MemberStatus, MembershipType, Gender, MaritalStatus } from '@lftcm/database';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  profession?: string;
  organizationId: string;
  branchId: string;
  departmentIds?: string[];
  status?: MemberStatus;
  membershipType?: MembershipType;
  joinedAt?: Date;
}

export interface UpdateMemberInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  profession?: string;
  branchId?: string;
  status?: MemberStatus;
  membershipType?: MembershipType;
  departmentIds?: string[];
}

export interface MemberFilters {
  organizationId?: string;
  branchId?: string;
  status?: MemberStatus;
  membershipType?: MembershipType;
  departmentId?: string;
  search?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  ageMin?: number;
  ageMax?: number;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Generate unique member ID (e.g., LFTCM-YAO-000001)
export async function generateMemberId(organizationCode: string, branchCode: string): Promise<string> {
  const prefix = `${organizationCode}-${branchCode}`;

  // Get count of existing members for this branch
  const count = await prisma.member.count({
    where: {
      branch: { code: branchCode },
    },
  });

  const sequence = (count + 1).toString().padStart(6, '0');
  return `${prefix}-${sequence}`;
}

// Create member
export async function createMember(input: CreateMemberInput) {
  const {
    email,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    maritalStatus,
    address,
    city,
    profession,
    organizationId,
    branchId,
    departmentIds,
    status = 'ACTIVE',
    membershipType = 'REGULAR',
    joinedAt = new Date(),
  } = input;

  // Get organization and branch codes for ID generation
  const [organization, branch] = await Promise.all([
    prisma.organization.findUnique({ where: { id: organizationId } }),
    prisma.branch.findUnique({ where: { id: branchId } }),
  ]);

  if (!organization || !branch) {
    throw new AppError('NOT_FOUND', 'Organization or branch not found', 404);
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
  }

  // Generate member ID
  const memberId = await generateMemberId(organization.code, branch.code);

  // Create user and member in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        role: 'MEMBER',
        organizationId,
        branchId,
      },
    });

    // Create member
    const member = await tx.member.create({
      data: {
        id: memberId,
        userId: user.id,
        organizationId,
        branchId,
        status,
        membershipType,
        joinedAt,
        dateOfBirth,
        gender,
        maritalStatus,
        address,
        city,
        profession,
      },
      include: {
        user: true,
        branch: true,
      },
    });

    // Add to departments if specified
    if (departmentIds && departmentIds.length > 0) {
      await tx.departmentMembership.createMany({
        data: departmentIds.map((deptId) => ({
          memberId: member.id,
          departmentId: deptId,
          role: 'MEMBER',
          joinedAt: new Date(),
        })),
      });
    }

    return member;
  });

  return result;
}

// Get member by ID
export async function getMemberById(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
        },
      },
      branch: true,
      departmentMemberships: {
        include: {
          department: true,
        },
      },
      attendanceRecords: {
        take: 10,
        orderBy: { eventDate: 'desc' },
      },
      _count: {
        select: {
          attendanceRecords: true,
          givingRecords: true,
        },
      },
    },
  });

  if (!member) {
    throw new AppError('NOT_FOUND', 'Member not found', 404);
  }

  return member;
}

// Update member
export async function updateMember(id: string, input: UpdateMemberInput) {
  const member = await prisma.member.findUnique({ where: { id } });

  if (!member) {
    throw new AppError('NOT_FOUND', 'Member not found', 404);
  }

  const {
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    maritalStatus,
    address,
    city,
    profession,
    branchId,
    status,
    membershipType,
    departmentIds,
  } = input;

  // Update in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update user if personal info changed
    if (firstName || lastName || phone) {
      await tx.user.update({
        where: { id: member.userId },
        data: {
          firstName,
          lastName,
          phone,
        },
      });
    }

    // Update member
    const updatedMember = await tx.member.update({
      where: { id },
      data: {
        dateOfBirth,
        gender,
        maritalStatus,
        address,
        city,
        profession,
        branchId,
        status,
        membershipType,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
          },
        },
        branch: true,
      },
    });

    // Update department memberships if specified
    if (departmentIds) {
      // Remove existing memberships
      await tx.departmentMembership.deleteMany({
        where: { memberId: id },
      });

      // Add new memberships
      if (departmentIds.length > 0) {
        await tx.departmentMembership.createMany({
          data: departmentIds.map((deptId) => ({
            memberId: id,
            departmentId: deptId,
            role: 'MEMBER',
            joinedAt: new Date(),
          })),
        });
      }
    }

    return updatedMember;
  });

  return result;
}

// Delete member (soft delete)
export async function deleteMember(id: string) {
  const member = await prisma.member.findUnique({ where: { id } });

  if (!member) {
    throw new AppError('NOT_FOUND', 'Member not found', 404);
  }

  // Soft delete - update status to INACTIVE
  await prisma.member.update({
    where: { id },
    data: { status: 'INACTIVE', leftAt: new Date() },
  });

  return { success: true };
}

// List members with filtering and pagination
export async function listMembers(
  filters: MemberFilters,
  pagination: PaginationInput = {}
) {
  const {
    organizationId,
    branchId,
    status,
    membershipType,
    departmentId,
    search,
    gender,
    maritalStatus,
    ageMin,
    ageMax,
  } = filters;

  const { page = 1, limit = 20, sortBy = 'joinedAt', sortOrder = 'desc' } = pagination;

  // Build where clause
  const where: any = {};

  if (organizationId) where.organizationId = organizationId;
  if (branchId) where.branchId = branchId;
  if (status) where.status = status;
  if (membershipType) where.membershipType = membershipType;
  if (gender) where.gender = gender;
  if (maritalStatus) where.maritalStatus = maritalStatus;

  if (departmentId) {
    where.departmentMemberships = {
      some: { departmentId },
    };
  }

  // Age filtering
  if (ageMin !== undefined || ageMax !== undefined) {
    const now = new Date();
    if (ageMin !== undefined) {
      where.dateOfBirth = {
        ...where.dateOfBirth,
        lte: new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate()),
      };
    }
    if (ageMax !== undefined) {
      where.dateOfBirth = {
        ...where.dateOfBirth,
        gte: new Date(now.getFullYear() - ageMax, now.getMonth(), now.getDate()),
      };
    }
  }

  // Search by name or email
  if (search) {
    where.OR = [
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { user: { phone: { contains: search } } },
    ];
  }

  // Get total count
  const total = await prisma.member.count({ where });

  // Get members
  const members = await prisma.member.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatarUrl: true,
        },
      },
      branch: {
        select: { id: true, name: true },
      },
      departmentMemberships: {
        include: {
          department: { select: { id: true, name: true } },
        },
      },
      _count: {
        select: {
          attendanceRecords: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  return {
    data: members,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get member statistics
export async function getMemberStats(organizationId: string, branchId?: string) {
  const where: any = { organizationId };
  if (branchId) where.branchId = branchId;

  const [
    total,
    active,
    byGender,
    byMembershipType,
    newThisMonth,
  ] = await Promise.all([
    prisma.member.count({ where }),
    prisma.member.count({ where: { ...where, status: 'ACTIVE' } }),
    prisma.member.groupBy({
      by: ['gender'],
      where,
      _count: { gender: true },
    }),
    prisma.member.groupBy({
      by: ['membershipType'],
      where,
      _count: { membershipType: true },
    }),
    prisma.member.count({
      where: {
        ...where,
        joinedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return {
    total,
    active,
    inactive: total - active,
    byGender: byGender.reduce((acc, item) => {
      acc[item.gender || 'UNKNOWN'] = item._count.gender;
      return acc;
    }, {} as Record<string, number>),
    byMembershipType: byMembershipType.reduce((acc, item) => {
      acc[item.membershipType] = item._count.membershipType;
      return acc;
    }, {} as Record<string, number>),
    newThisMonth,
  };
}
