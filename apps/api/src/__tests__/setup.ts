import { PrismaClient } from '@lftcm/database';

const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Clean up after each test
afterEach(async () => {
  // Clear test data
  const tables = [
    'Donation',
    'EventRegistration',
    'Attendance',
    'Member',
    'User',
    'Event',
    'Sermon',
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
  }
});

// Global teardown
afterAll(async () => {
  await prisma.$disconnect();
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/lftcm_test';
