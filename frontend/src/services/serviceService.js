import api from './api';

export const getServices = (params = {}) =>
  api.get('/services', { params }).then((res) => res.data);

export const getAllServicesAdmin = (params = {}) =>
  api.get('/services/admin/all', { params }).then((res) => res.data);

export const getServiceById = (id) => api.get(`/services/${id}`).then((res) => res.data);

export const createService = (formData) =>
  api
    .post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

export const updateService = (id, formData) =>
  api
    .put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);

export const deleteService = (id) => api.delete(`/services/${id}`).then((res) => res.data);
