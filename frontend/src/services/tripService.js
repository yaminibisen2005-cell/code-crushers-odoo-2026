import api from './api';

export const tripService = {
  getAll: async () => {
    const response = await api.get('/api/trips');
    return response.data;
  },
  create: async (tripData) => {
    const response = await api.post('/api/trips', tripData);
    return response.data;
  },
  update: async (id, tripData) => {
    const response = await api.put(`/api/trips/${id}`, tripData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/trips/${id}`);
    return response.data;
  }
};
