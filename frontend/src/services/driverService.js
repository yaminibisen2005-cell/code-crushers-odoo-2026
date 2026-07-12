import api from './api';

export const driverService = {
  getAll: async () => {
    const response = await api.get('/api/drivers');
    return response.data;
  },
  create: async (driverData) => {
    const response = await api.post('/api/drivers', driverData);
    return response.data;
  },
  update: async (id, driverData) => {
    const response = await api.put(`/api/drivers/${id}`, driverData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/drivers/${id}`);
    return response.data;
  }
};
