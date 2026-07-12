import api from "./api";

const normalizeTripPayload = (tripData) => ({
  ...tripData,
  cargoWeight: Number(tripData.cargoWeight ?? 0),
  distance: Number(tripData.distance ?? 0),
});

export const tripService = {
  getAll: async () => {
    const response = await api.get("/api/trips");
    return response.data;
  },
  getAllTrips: async () => {
    return tripService.getAll();
  },
  getById: async (id) => {
    const response = await api.get(`/api/trips/${id}`);
    return response.data;
  },
  create: async (tripData) => {
    const response = await api.post(
      "/api/trips",
      normalizeTripPayload(tripData),
    );
    return response.data;
  },
  update: async (id, tripData) => {
    const response = await api.patch(
      `/api/trips/${id}/${tripData.status ? tripData.status.toLowerCase() : "dispatch"}`,
    );
    if (
      tripData.status &&
      !["dispatch", "complete", "cancel"].includes(
        tripData.status.toLowerCase(),
      )
    ) {
      return response.data;
    }
    return response.data;
  },
  dispatch: async (id) => {
    const response = await api.patch(`/api/trips/${id}/dispatch`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/api/trips/${id}/complete`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.patch(`/api/trips/${id}/cancel`);
    return response.data;
  },
};
