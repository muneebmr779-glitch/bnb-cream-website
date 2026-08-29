import api from './api';

export const register = (data) => api.post('/auth/register', data).then((res) => res.data);

export const login = (data) => api.post('/auth/login', data).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email }).then((res) => res.data);

export const resetPassword = (token, password) =>
  api.put(`/auth/reset-password/${token}`, { password }).then((res) => res.data);

export const updatePassword = (data) =>
  api.put('/auth/update-password', data).then((res) => res.data);

export const updateProfile = (data) =>
  api.put('/users/profile', data).then((res) => res.data);
