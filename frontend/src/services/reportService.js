import { analyticsService } from "./analyticsService";

export const reportService = {
  getReportData: async () => {
    return analyticsService.getAnalytics();
  },
};
