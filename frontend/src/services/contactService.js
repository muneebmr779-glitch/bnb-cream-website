import api from './api';

export const sendContactMessage = (data) => api.post('/contact', data).then((res) => res.data);

export const getContactMessages = (params = {}) =>
  api.get('/contact', { params }).then((res) => res.data);

export const markMessageRead = (id) => api.put(`/contact/${id}/read`).then((res) => res.data);

export const deleteContactMessage = (id) => api.delete(`/contact/${id}`).then((res) => res.data);
