import api from './api';

export const maintenanceService = {
  getAll: async () => {
    const response = await api.get('/api/maintenance');
    return response.data;
  },
  create: async (maintenanceData) => {
    const response = await api.post('/api/maintenance', maintenanceData);
    return response.data;
  },
  update: async (id, maintenanceData) => {
    const response = await api.put(`/api/maintenance/${id}`, maintenanceData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/maintenance/${id}`);
    return response.data;
  }
};
