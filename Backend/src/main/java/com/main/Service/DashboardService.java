package com.main.Service;

import org.springframework.stereotype.Service;

import com.main.dto.response.DashboardResponse;
import com.main.enums.DriverStatus;
import com.main.enums.TripStatus;
import com.main.enums.VehicleStatus;
import com.main.Repository.DriverRepository;
import com.main.Repository.TripRepository;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardResponse getDashboard() {

        long totalVehicles = vehicleRepository.count();

        long availableVehicles = vehicleRepository
                .findByStatus(VehicleStatus.AVAILABLE)
                .size();

        long maintenanceVehicles = vehicleRepository
                .findByStatus(VehicleStatus.IN_SHOP)
                .size();

        long activeTrips = tripRepository
                .countByStatus(TripStatus.DISPATCHED);

        long availableDrivers = driverRepository
                .findByStatus(DriverStatus.AVAILABLE)
                .size();

        double fleetUtilization = 0;

        if (totalVehicles > 0) {
            long onTripVehicles = vehicleRepository
                    .findByStatus(VehicleStatus.ON_TRIP)
                    .size();

            fleetUtilization =
                    ((double) onTripVehicles / totalVehicles) * 100;
        }

        return DashboardResponse.builder()
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .maintenanceVehicles(maintenanceVehicles)
                .activeTrips(activeTrips)
                .availableDrivers(availableDrivers)
                .fleetUtilization(fleetUtilization)
                .build();
    }
}