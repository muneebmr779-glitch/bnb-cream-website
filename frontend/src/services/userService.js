import api from './api';

export const getUsers = (params = {}) => api.get('/users', { params }).then((res) => res.data);

export const getUserById = (id) => api.get(`/users/${id}`).then((res) => res.data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data).then((res) => res.data);

export const deleteUser = (id) => api.delete(`/users/${id}`).then((res) => res.data);

export const getDashboardStats = () => api.get('/dashboard/stats').then((res) => res.data);
