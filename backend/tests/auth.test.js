const request = require('supertest');
const app = require('../server');
const { createUser } = require('./helpers');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new customer and returns a token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1-555-0102',
        password: 'SecurePass123!',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('jane@example.com');
      expect(res.body.user.role).toBe('customer');
      expect(res.body.user.password).toBeUndefined();
    });

    it('rejects duplicate email registration', async () => {
      await createUser({ email: 'dup@example.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Dup User',
        email: 'dup@example.com',
        phone: '+1-555-0103',
        password: 'SecurePass123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects a weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Weak Pass',
        email: 'weak@example.com',
        phone: '+1-555-0104',
        password: '123',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid credentials', async () => {
      await createUser({ email: 'login@example.com', password: 'SecurePass123!' });

      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'SecurePass123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('rejects invalid credentials', async () => {
      await createUser({ email: 'login2@example.com', password: 'SecurePass123!' });

      const res = await request(app).post('/api/auth/login').send({
        email: 'login2@example.com',
        password: 'WrongPassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the current user when authenticated', async () => {
      const { token, user } = await createUser({ email: 'me@example.com' });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(user.email);
    });

    it('rejects requests without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('returns a generic success response regardless of whether the email exists', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'doesnotexist@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
