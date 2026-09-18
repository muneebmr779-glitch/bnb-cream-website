const request = require('supertest');
const app = require('../server');
const { createAdmin, createUser, createService } = require('./helpers');

describe('Services API', () => {
  it('lists only active services publicly', async () => {
    await createService({ name: 'Active Service', isActive: true });
    await createService({ name: 'Inactive Service', isActive: false });

    const res = await request(app).get('/api/services');

    expect(res.status).toBe(200);
    expect(res.body.services).toHaveLength(1);
    expect(res.body.services[0].name).toBe('Active Service');
  });

  it('filters services by search term', async () => {
    await createService({ name: 'Brake Repair' });
    await createService({ name: 'Oil Change' });

    const res = await request(app).get('/api/services?search=brake');

    expect(res.status).toBe(200);
    expect(res.body.services).toHaveLength(1);
    expect(res.body.services[0].name).toBe('Brake Repair');
  });

  it('gets a single service by id', async () => {
    const service = await createService();
    const res = await request(app).get(`/api/services/${service._id}`);

    expect(res.status).toBe(200);
    expect(res.body.service.name).toBe(service.name);
  });

  it('allows an admin to create a service', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Service',
        description: 'A brand new service',
        price: 59,
        duration: '1 hour',
        category: 'maintenance',
      });

    expect(res.status).toBe(201);
    expect(res.body.service.name).toBe('New Service');
  });

  it('rejects service creation from a non-admin customer', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Blocked Service',
        description: 'Should not be created',
        price: 10,
        duration: '10 min',
      });

    expect(res.status).toBe(403);
  });

  it('rejects service creation with missing required fields', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
  });

  it('allows an admin to update and delete a service', async () => {
    const { token } = await createAdmin();
    const service = await createService();

    const updateRes = await request(app)
      .put(`/api/services/${service._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 75 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.service.price).toBe(75);

    const deleteRes = await request(app)
      .delete(`/api/services/${service._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
  });
});
