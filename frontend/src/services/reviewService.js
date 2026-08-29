import api from './api';

export const getReviews = (params = {}) => api.get('/reviews', { params }).then((res) => res.data);

export const createReview = (data) => api.post('/reviews', data).then((res) => res.data);

export const updateReviewStatus = (id, approved) =>
  api.put(`/reviews/${id}`, { approved }).then((res) => res.data);

export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((res) => res.data);
