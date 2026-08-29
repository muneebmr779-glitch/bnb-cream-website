import api from './api';

export const getMyVehicles = () => api.get('/vehicles').then((res) => res.data);

export const addVehicle = (data) => api.post('/vehicles', data).then((res) => res.data);

export const updateVehicle = (id, data) =>
  api.put(`/vehicles/${id}`, data).then((res) => res.data);

export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`).then((res) => res.data);
