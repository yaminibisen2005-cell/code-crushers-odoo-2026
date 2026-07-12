import api from "./api";

const normalizeMaintenanceStatus = (status) => {
  const value = String(status ?? "").trim().toLowerCase();
  if (!value) return "ACTIVE";

  if (["pending", "in progress", "in_progress", "in-progress"].includes(value)) {
    return "ACTIVE";
  }

  if (["completed", "done"].includes(value)) {
    return "COMPLETED";
  }

  return value.toUpperCase();
};

const normalizeMaintenancePayload = (maintenanceData) => ({
  ...maintenanceData,
  issue: maintenanceData.issue || maintenanceData.notes || maintenanceData.type || "Maintenance service",
  cost: Number(maintenanceData.cost ?? 0),
  date: maintenanceData.date || null,
  status: normalizeMaintenanceStatus(maintenanceData.status),
});

export const maintenanceService = {
  getAll: async () => {
    const response = await api.get("/api/maintenance");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/maintenance/${id}`);
    return response.data;
  },
  create: async (maintenanceData) => {
    const vehicleId = maintenanceData.vehicleId;
    const response = await api.post(
      `/api/maintenance/vehicle/${vehicleId}`,
      normalizeMaintenancePayload(maintenanceData),
    );
    return response.data;
  },
  update: async (id, maintenanceData) => {
    const response = await api.put(
      `/api/maintenance/${id}`,
      normalizeMaintenancePayload(maintenanceData),
    );
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/api/maintenance/${id}/complete`);
    return response.data;
  },
};
