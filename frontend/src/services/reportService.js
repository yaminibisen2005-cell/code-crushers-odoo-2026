import api from './api';

export const reportService = {
  getReportData: async () => {
    const response = await api.get('/api/reports');
    return response.data;
  }
};
