import api from './api';

export const createAppointment = (data) =>
  api.post('/appointments', data).then((res) => res.data);

export const getMyAppointments = (params = {}) =>
  api.get('/appointments/my', { params }).then((res) => res.data);

export const getAppointments = (params = {}) =>
  api.get('/appointments', { params }).then((res) => res.data);

export const getAppointmentById = (id) =>
  api.get(`/appointments/${id}`).then((res) => res.data);

export const updateAppointmentStatus = (id, data) =>
  api.put(`/appointments/${id}/status`, data).then((res) => res.data);

export const rescheduleAppointment = (id, data) =>
  api.put(`/appointments/${id}/reschedule`, data).then((res) => res.data);

export const cancelAppointment = (id) =>
  api.put(`/appointments/${id}/cancel`).then((res) => res.data);
