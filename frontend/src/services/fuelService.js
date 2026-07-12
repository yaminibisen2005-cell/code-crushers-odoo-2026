import api from "./api";

const normalizeFuelPayload = (fuelData) => ({
  ...fuelData,
  liters: Number(fuelData.liters ?? 0),
  cost: Number(fuelData.cost ?? 0),
  amount: Number(fuelData.amount ?? fuelData.cost ?? 0),
  date: fuelData.date,
});

export const fuelService = {
  getAll: async () => {
    const response = await api.get("/api/fuel");
    return response.data;
  },
  getAllFuelRecords: async () => {
    return fuelService.getAll();
  },
  create: async (fuelData) => {
    const vehicleId = fuelData.vehicleId;
    const response = await api.post(
      `/api/fuel/vehicle/${vehicleId}`,
      normalizeFuelPayload(fuelData),
    );
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/fuel/${id}`);
    return response.data;
  },
};
