package com.main.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.main.Entity.Vehicle;
import com.main.enums.VehicleStatus;
import com.main.exception.BusinessException;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle addVehicle(Vehicle vehicle) {

        if (vehicleRepository.existsByRegistrationNumber(
                vehicle.getRegistrationNumber())) {
            throw new BusinessException(
                    "Vehicle registration number already exists");
        }

        vehicle.setStatus(VehicleStatus.AVAILABLE);

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Vehicle not found"));
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicle) {

        Vehicle existingVehicle = getVehicleById(id);

        existingVehicle.setRegistrationNumber(
                vehicle.getRegistrationNumber());
        existingVehicle.setName(vehicle.getName());
        existingVehicle.setType(vehicle.getType());
        existingVehicle.setCapacity(vehicle.getCapacity());
        existingVehicle.setOdometer(vehicle.getOdometer());

        return vehicleRepository.save(existingVehicle);
    }

    public void deleteVehicle(Long id) {

        Vehicle vehicle = getVehicleById(id);

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessException(
                    "Vehicle on active trip cannot be deleted");
        }

        vehicleRepository.delete(vehicle);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository
                .findByStatus(VehicleStatus.AVAILABLE);
    }
}