import api from "./api";

const normalizeVehicleStatusForApi = (status) => {
  const value = String(status ?? "AVAILABLE")
    .trim()
    .toUpperCase();
  const mapping = {
    AVAILABLE: "AVAILABLE",
    "ON TRIP": "ON_TRIP",
    ON_TRIP: "ON_TRIP",
    "IN SHOP": "IN_SHOP",
    IN_SHOP: "IN_SHOP",
    RETIRED: "RETIRED",
  };

  return mapping[value] ?? value;
};

const normalizeVehicleStatusForUi = (status) => {
  const value = String(status ?? "AVAILABLE")
    .trim()
    .toUpperCase();
  const mapping = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
  };

  return mapping[value] ?? value;
};

const parseNumericValue = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return fallback;
    }

    const match = trimmed.match(/-?\d+(?:\.\d+)?/);
    if (match) {
      return Number(match[0]);
    }
  }

  return fallback;
};

const normalizeVehiclePayload = (vehicleData) => {
  const payload = {
    ...vehicleData,
    registrationNumber:
      vehicleData.registrationNumber || vehicleData.registrationNo || "",
    capacity: parseNumericValue(vehicleData.capacity, 0),
    odometer: parseNumericValue(vehicleData.odometer, 0),
    cost: parseNumericValue(vehicleData.cost, 0),
    status: normalizeVehicleStatusForApi(vehicleData.status),
  };

  delete payload.registrationNo;
  return payload;
};

const normalizeVehicleResponse = (vehicle) => ({
  ...vehicle,
  registrationNo: vehicle?.registrationNo ?? vehicle?.registrationNumber ?? "",
  registrationNumber:
    vehicle?.registrationNumber ?? vehicle?.registrationNo ?? "",
  cost: Number(vehicle?.cost ?? 0),
  status: normalizeVehicleStatusForUi(vehicle?.status),
});

const normalizeVehicleList = (data) =>
  Array.isArray(data)
    ? data.map(normalizeVehicleResponse)
    : normalizeVehicleResponse(data);

export const vehicleService = {
  getAll: async () => {
    const response = await api.get("/api/vehicles");
    return normalizeVehicleList(response.data);
  },
  getById: async (id) => {
    const response = await api.get(`/api/vehicles/${id}`);
    return normalizeVehicleResponse(response.data);
  },
  getAvailable: async () => {
    const response = await api.get("/api/vehicles/available");
    return normalizeVehicleList(response.data);
  },
  create: async (vehicleData) => {
    const response = await api.post(
      "/api/vehicles",
      normalizeVehiclePayload(vehicleData),
    );
    return normalizeVehicleResponse(response.data);
  },
  update: async (id, vehicleData) => {
    const response = await api.put(
      `/api/vehicles/${id}`,
      normalizeVehiclePayload(vehicleData),
    );
    return normalizeVehicleResponse(response.data);
  },
  delete: async (id) => {
    const response = await api.delete(`/api/vehicles/${id}`);
    return response.data;
  },
};
