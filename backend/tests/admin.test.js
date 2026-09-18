const request = require('supertest');
const app = require('../server');
const { createUser, createAdmin } = require('./helpers');

describe('Admin authorization', () => {
  it('blocks unauthenticated access to admin dashboard stats', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });

  it('blocks a regular customer from admin dashboard stats', async () => {
    const { token } = await createUser();
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('allows an admin to access dashboard stats', async () => {
    const { token } = await createAdmin();
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.totalCustomers).toBeDefined();
  });

  it('blocks a customer from listing all customers', async () => {
    const { token } = await createUser();
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin to list customers', async () => {
    await createUser();
    const { token } = await createAdmin();

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('rejects an invalid/tampered token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid.token.value');

    expect(res.status).toBe(401);
  });
});
