const request = require('supertest');
const app = require('../server');
const { createUser, createService } = require('./helpers');

describe('Input validation', () => {
  it('rejects registration with an invalid email format', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Bad Email',
      email: 'not-an-email',
      phone: '+1-555-0105',
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(400);
  });

  it('rejects registration with a missing name', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'noname@example.com',
      phone: '+1-555-0106',
      password: 'SecurePass123!',
    });

    expect(res.status).toBe(400);
  });

  it('rejects a booking with a missing service id', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        vehicleYear: 2019,
        registrationNumber: 'XYZ-999',
        date: '2099-01-01',
        time: '9:00 AM',
      });

    expect(res.status).toBe(400);
  });

  it('rejects a booking with an invalid vehicle year', async () => {
    const { token } = await createUser();
    const service = await createService();

    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicleMake: 'Honda',
        vehicleModel: 'Civic',
        vehicleYear: 1800,
        registrationNumber: 'XYZ-999',
        serviceId: service._id.toString(),
        date: '2099-01-01',
        time: '9:00 AM',
      });

    expect(res.status).toBe(400);
  });

  it('rejects a contact message with a missing subject', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Contact Test',
      email: 'contact@example.com',
      message: 'Hello there',
    });

    expect(res.status).toBe(400);
  });

  it('rejects a review with an out-of-range rating', async () => {
    const { token } = await createUser();

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        appointmentId: '64b7f9e2c9a1f2a1b8e4d123',
        rating: 9,
        comment: 'Great service',
      });

    expect(res.status).toBe(400);
  });
});
