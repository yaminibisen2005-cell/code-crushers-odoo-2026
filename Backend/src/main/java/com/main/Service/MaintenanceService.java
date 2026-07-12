package com.main.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.main.Entity.Maintenance;
import com.main.Entity.Vehicle;
import com.main.enums.MaintenanceStatus;
import com.main.enums.VehicleStatus;
import com.main.exception.BusinessException;
import com.main.Repository.MaintenanceRepository;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public Maintenance createMaintenance(
            Long vehicleId,
            Maintenance maintenance) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new BusinessException("Vehicle not found"));

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessException(
                    "Vehicle on trip cannot be sent for maintenance");
        }

        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessException(
                    "Retired vehicle cannot be sent for maintenance");
        }

        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new BusinessException(
                    "Vehicle is already in maintenance");
        }

        maintenance.setVehicle(vehicle);
        if (maintenance.getIssue() == null || maintenance.getIssue().isBlank()) {
            maintenance.setIssue("Maintenance service");
        }
        if (maintenance.getStatus() == null) {
            maintenance.setStatus(MaintenanceStatus.ACTIVE);
        }

        if (maintenance.getDate() == null) {
            maintenance.setDate(LocalDate.now());
        }

        vehicle.setStatus(VehicleStatus.IN_SHOP);

        vehicleRepository.save(vehicle);

        return maintenanceRepository.save(maintenance);
    }

    @Transactional
    public Maintenance updateMaintenance(Long id, Maintenance maintenance) {
        Maintenance existingMaintenance = getMaintenanceById(id);

        if (maintenance.getIssue() != null && !maintenance.getIssue().isBlank()) {
            existingMaintenance.setIssue(maintenance.getIssue());
        }
        if (maintenance.getCost() != null) {
            existingMaintenance.setCost(maintenance.getCost());
        }
        if (maintenance.getDate() != null) {
            existingMaintenance.setDate(maintenance.getDate());
        }
        if (maintenance.getStatus() != null) {
            existingMaintenance.setStatus(maintenance.getStatus());
        }

        return maintenanceRepository.save(existingMaintenance);
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Maintenance record not found"));
    }

    @Transactional
    public Maintenance completeMaintenance(Long id) {

        Maintenance maintenance = getMaintenanceById(id);

        if (maintenance.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new BusinessException(
                    "Maintenance is already completed");
        }

        maintenance.setStatus(MaintenanceStatus.COMPLETED);

        Vehicle vehicle = maintenance.getVehicle();

        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }

        vehicleRepository.save(vehicle);

        return maintenanceRepository.save(maintenance);
    }
}