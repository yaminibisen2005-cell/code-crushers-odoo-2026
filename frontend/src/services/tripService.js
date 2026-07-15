import api from "./api";

const normalizeTripPayload = (tripData) => ({
  source: tripData.source || tripData.from,
  destination: tripData.destination || tripData.to,
  vehicleId: Number(tripData.vehicleId || tripData.vehicleId || 0),
  driverId: Number(tripData.driverId || tripData.driverId || 0),
  cargoWeight: Number(tripData.cargoWeight || tripData.cargoWeight || 0),
  distance: Number(tripData.distance || tripData.distance || 0),
});

export const tripService = {
  getAll: async () => {
    const response = await api.get("/trips");
    return response.data;
  },
  getAllTrips: async () => {
    return tripService.getAll();
  },
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (tripData) => {
    const response = await api.post(
      "/trips",
      normalizeTripPayload(tripData),
    );
    return response.data;
  },
  update: async (id, tripData) => {
    // For status updates, use the specific backend endpoints
    if (tripData.status) {
      const status = tripData.status.toLowerCase();
      if (status === 'dispatch' || status === 'dispatched') {
        return tripService.dispatch(id);
      } else if (status === 'complete' || status === 'completed') {
        return tripService.complete(id);
      } else if (status === 'cancel' || status === 'cancelled') {
        return tripService.cancel(id);
      }
    }
    // For other updates, we might need a PUT endpoint, but backend doesn't have one yet
    // So we'll just return the data as-is for now
    return tripData;
  },
  dispatch: async (id) => {
    const response = await api.patch(`/trips/${id}/dispatch`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/trips/${id}/complete`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.patch(`/trips/${id}/cancel`);
    return response.data;
  },
};
