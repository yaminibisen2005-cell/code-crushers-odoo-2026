import api from "./api";

const normalizeMaintenancePayload = (maintenanceData) => ({
  ...maintenanceData,
  vehicleId: maintenanceData.vehicleId,
  issue: maintenanceData.issue || maintenanceData.notes || maintenanceData.type,
  cost: Number(maintenanceData.cost ?? 0),
  date: maintenanceData.date,
  status: maintenanceData.status || "IN_PROGRESS",
});

export const maintenanceService = {
  getAll: async () => {
    const response = await api.get("/maintenance");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },
  create: async (maintenanceData) => {
    const vehicleId = maintenanceData.vehicleId;
    const response = await api.post(
      `/maintenance/vehicle/${vehicleId}`,
      normalizeMaintenancePayload(maintenanceData),
    );
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/maintenance/${id}/complete`);
    return response.data;
  },
};
