import api from "./api";

const normalizeAnalytics = (analytics = {}) => {
  const totalFuelCost = Number(
    analytics.totalFuelCost || analytics.totalFuel || 0,
  );
  const totalExpenses = Number(analytics.totalExpenses || 0);
  const maintenanceCost = Number(analytics.maintenanceCost || 0);
  const operationalCost = Number(
    analytics.operationalCost || totalExpenses + maintenanceCost,
  );
  const totalFuelUsed = Number(analytics.totalFuelUsed || 0);
  const fuelEfficiency = Number(analytics.fuelEfficiency || 0);

  return {
    summary: {
      fuelEfficiency: `${fuelEfficiency.toFixed(1)} km/L`,
      fleetUtilization: `${Math.min(100, Math.max(0, Math.round(fuelEfficiency * 4))).toFixed(0)}%`,
      operationalCost,
      roi: `${Math.max(0, Math.round((fuelEfficiency / 10) * 100) / 100).toFixed(2)}%`,
    },
    charts: {
      monthlyCosts: [
        {
          name: "Current Month",
          fuel: totalFuelCost,
          maint: maintenanceCost,
        },
      ],
      costDistribution: [
        { name: "Fuel", value: totalFuelCost },
        { name: "Maintenance", value: maintenanceCost },
        { name: "Other", value: totalExpenses },
      ],
      efficiencyTrend: [
        {
          name: "Fleet Avg",
          value: fuelEfficiency,
        },
      ],
    },
  };
};

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get("/analytics");
    return normalizeAnalytics(response.data);
  },
};
