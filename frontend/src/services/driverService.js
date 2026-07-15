import api from "./api";

const normalizeDriverPayload = (driverData) => {
  // Ensure status is a valid enum value
  const validStatuses = ['AVAILABLE', 'OFF_DUTY', 'ON_TRIP', 'SUSPENDED'];
  const status = String(driverData.status || 'AVAILABLE').toUpperCase();
  const normalizedStatus = validStatuses.includes(status) ? status : 'AVAILABLE';

  return {
    ...driverData,
    licenseNumber: driverData.licenseNumber || driverData.licenseNo,
    licenseExpiryDate: driverData.licenseExpiryDate || driverData.expiryDate,
    safetyScore: Number(driverData.safetyScore ?? 0),
    status: normalizedStatus,
  };
};

export const driverService = {
  getAll: async () => {
    const response = await api.get("/drivers");
    return response.data;
  },
  getAllDrivers: async () => {
    return driverService.getAll();
  },
  getById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },
  getAvailable: async () => {
    const response = await api.get("/drivers/available");
    return response.data;
  },
  create: async (driverData) => {
    const response = await api.post(
      "/drivers",
      normalizeDriverPayload(driverData),
    );
    return response.data;
  },
  update: async (id, driverData) => {
    const response = await api.put(
      `/drivers/${id}`,
      normalizeDriverPayload(driverData),
    );
    return response.data;
  },
  changeStatus: async (id, status) => {
    const response = await api.patch(`/drivers/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },
};
