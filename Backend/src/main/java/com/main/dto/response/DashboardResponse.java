package com.main.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalVehicles;
    private long availableVehicles;
    private long maintenanceVehicles;
    private long activeTrips;
    private long availableDrivers;
    private double fleetUtilization;
}