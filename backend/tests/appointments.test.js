const request = require('supertest');
const app = require('../server');
const { createUser, createAdmin, createService } = require('./helpers');

const futureDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

const bookingPayload = (serviceId, overrides = {}) => ({
  vehicleMake: 'Toyota',
  vehicleModel: 'Corolla',
  vehicleYear: 2020,
  registrationNumber: 'ABC-123',
  serviceId,
  date: futureDate(),
  time: '10:00 AM',
  message: 'Please check the brakes too',
  ...overrides,
});

describe('Appointments API', () => {
  it('allows a logged-in customer to book an appointment', async () => {
    const { token } = await createUser();
    const service = await createService();

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingPayload(service._id.toString()));

    expect(res.status).toBe(201);
    expect(res.body.appointment.bookingId).toBeDefined();
    expect(res.body.appointment.status).toBe('pending');
    expect(res.body.appointment.service.name).toBe(service.name);
  });

  it('rejects booking without authentication', async () => {
    const service = await createService();

    const res = await request(app)
      .post('/api/appointments')
      .send(bookingPayload(service._id.toString()));

    expect(res.status).toBe(401);
  });

  it('rejects booking with a past date', async () => {
    const { token } = await createUser();
    const service = await createService();

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingPayload(service._id.toString(), { date: '2000-01-01' }));

    expect(res.status).toBe(400);
  });

  it('lets a customer view only their own appointments', async () => {
    const { token: tokenA } = await createUser({ email: 'a@example.com' });
    const { token: tokenB } = await createUser({ email: 'b@example.com' });
    const service = await createService();

    await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(bookingPayload(service._id.toString()));

    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body.appointments).toHaveLength(0);
  });

  it('allows an admin to view and update appointment status', async () => {
    const { token: customerToken } = await createUser();
    const { token: adminToken } = await createAdmin();
    const service = await createService();

    const bookingRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(bookingPayload(service._id.toString()));

    const appointmentId = bookingRes.body.appointment._id;

    const listRes = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.appointments.length).toBeGreaterThanOrEqual(1);

    const statusRes = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.appointment.status).toBe('confirmed');
  });

  it('prevents a customer from viewing the admin appointment list', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('allows a customer to cancel their own pending appointment', async () => {
    const { token } = await createUser();
    const service = await createService();

    const bookingRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingPayload(service._id.toString()));

    const appointmentId = bookingRes.body.appointment._id;

    const cancelRes = await request(app)
      .put(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.appointment.status).toBe('cancelled');
  });

  it('prevents a customer from cancelling another customer appointment', async () => {
    const { token: tokenA } = await createUser({ email: 'owner@example.com' });
    const { token: tokenB } = await createUser({ email: 'intruder@example.com' });
    const service = await createService();

    const bookingRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${tokenA}`)
      .send(bookingPayload(service._id.toString()));

    const appointmentId = bookingRes.body.appointment._id;

    const cancelRes = await request(app)
      .put(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(cancelRes.status).toBe(403);
  });
});
