import api from './api';

export const fuelService = {
  getAll: async () => {
    const response = await api.get('/api/fuel');
    return response.data;
  },
  create: async (fuelData) => {
    const response = await api.post('/api/fuel', fuelData);
    return response.data;
  },
  update: async (id, fuelData) => {
    const response = await api.put(`/api/fuel/${id}`, fuelData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/fuel/${id}`);
    return response.data;
  }
};
