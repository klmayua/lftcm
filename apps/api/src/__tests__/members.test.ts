import request from 'supertest';
import { app } from '../index';

describe('Members API', () => {
  let accessToken: string;
  let adminToken: string;

  beforeEach(async () => {
    // Create regular user
    const userResponse = await request(app).post('/api/auth/register').send({
      email: 'user@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      branchId: 'test-branch',
    });
    accessToken = userResponse.body.data.accessToken;

    // Create admin user (would need to be assigned admin role)
    const adminResponse = await request(app).post('/api/auth/register').send({
      email: 'admin@example.com',
      password: 'Test123!',
      firstName: 'Admin',
      lastName: 'User',
      branchId: 'test-branch',
    });
    adminToken = adminResponse.body.data.accessToken;
  });

  describe('GET /api/members', () => {
    it('should list members for authenticated user', async () => {
      const response = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter members by status', async () => {
      const response = await request(app)
        .get('/api/members?status=ACTIVE')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .get('/api/members')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/members/stats', () => {
    it('should return member statistics', async () => {
      const response = await request(app)
        .get('/api/members/stats')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('active');
    });
  });

  describe('POST /api/members', () => {
    it('should create member with proper role', async () => {
      const newMember = {
        email: 'newmember@example.com',
        firstName: 'New',
        lastName: 'Member',
        phone: '237650000001',
        branchId: 'test-branch',
      };

      const response = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newMember)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(newMember.email);
    });

    it('should reject without proper role', async () => {
      const newMember = {
        email: 'newmember@example.com',
        firstName: 'New',
        lastName: 'Member',
        branchId: 'test-branch',
      };

      const response = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newMember)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
