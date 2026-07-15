import api from "./api";

const normalizeExpensePayload = (expenseData) => ({
  ...expenseData,
  amount: Number(expenseData.amount ?? 0),
  cost: Number(expenseData.cost ?? 0),
  date: expenseData.date,
});

export const expenseService = {
  getAll: async () => {
    const response = await api.get("/expenses");
    return response.data;
  },
  create: async (expenseData) => {
    const vehicleId = expenseData.vehicleId;
    const tripId = expenseData.tripId;
    const params = {};
    if (tripId) {
      params.tripId = tripId;
    }
    const response = await api.post(
      `/expenses/vehicle/${vehicleId}`,
      normalizeExpensePayload(expenseData),
      { params },
    );
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};
