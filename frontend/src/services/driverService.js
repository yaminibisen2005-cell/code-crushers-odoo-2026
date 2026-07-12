import api from "./api";

const normalizeDriverPayload = (driverData) => ({
  ...driverData,
  licenseNumber: driverData.licenseNumber || driverData.licenseNo,
  licenseExpiryDate: driverData.licenseExpiryDate || driverData.expiryDate,
  safetyScore: Number(driverData.safetyScore ?? 0),
  status: driverData.status || "AVAILABLE",
});

export const driverService = {
  getAll: async () => {
    const response = await api.get("/api/drivers");
    return response.data;
  },
  getAllDrivers: async () => {
    return driverService.getAll();
  },
  getById: async (id) => {
    const response = await api.get(`/api/drivers/${id}`);
    return response.data;
  },
  getAvailable: async () => {
    const response = await api.get("/api/drivers/available");
    return response.data;
  },
  create: async (driverData) => {
    const response = await api.post(
      "/api/drivers",
      normalizeDriverPayload(driverData),
    );
    return response.data;
  },
  update: async (id, driverData) => {
    const response = await api.put(
      `/api/drivers/${id}`,
      normalizeDriverPayload(driverData),
    );
    return response.data;
  },
  changeStatus: async (id, status) => {
    const response = await api.patch(`/api/drivers/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/drivers/${id}`);
    return response.data;
  },
};
