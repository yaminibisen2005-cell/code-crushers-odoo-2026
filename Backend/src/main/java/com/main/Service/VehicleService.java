package com.main.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.main.Entity.Vehicle;
import com.main.enums.VehicleStatus;
import com.main.exception.BusinessException;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private static final Pattern NUMBER_PATTERN = Pattern.compile("-?\\d+(?:\\.\\d+)?");

    private final VehicleRepository vehicleRepository;

    private Double parseDoubleValue(Object value, Double defaultValue) {
        if (value == null) {
            return defaultValue;
        }

        if (value instanceof Number number) {
            return number.doubleValue();
        }

        if (value instanceof String stringValue) {
            String trimmed = stringValue.trim();
            if (trimmed.isBlank()) {
                return defaultValue;
            }

            Matcher matcher = NUMBER_PATTERN.matcher(trimmed);
            if (matcher.find()) {
                return Double.parseDouble(matcher.group());
            }
        }

        return defaultValue;
    }

    public Vehicle addVehicle(Vehicle vehicle) {

        String registrationNumber = vehicle.getRegistrationNumber();
        if (registrationNumber == null || registrationNumber.isBlank()) {
            registrationNumber = vehicle.getRegistrationNo();
        }

        if (registrationNumber == null || registrationNumber.isBlank()) {
            throw new BusinessException("Vehicle registration number is required");
        }

        if (vehicleRepository.existsByRegistrationNumber(registrationNumber)) {
            throw new BusinessException("Vehicle registration number already exists");
        }

        vehicle.setRegistrationNumber(registrationNumber);
        vehicle.setCapacity(parseDoubleValue(vehicle.getCapacity(), 0.0));
        vehicle.setOdometer(parseDoubleValue(vehicle.getOdometer(), 0.0));
        vehicle.setCost(parseDoubleValue(vehicle.getCost(), 0.0));
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }

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

        String registrationNumber = vehicle.getRegistrationNumber();
        if (registrationNumber == null || registrationNumber.isBlank()) {
            registrationNumber = vehicle.getRegistrationNo();
        }

        if (registrationNumber != null && !registrationNumber.isBlank()) {
            existingVehicle.setRegistrationNumber(registrationNumber);
        }
        existingVehicle.setName(vehicle.getName());
        existingVehicle.setType(vehicle.getType());
        if (vehicle.getCapacity() != null) {
            existingVehicle.setCapacity(parseDoubleValue(vehicle.getCapacity(), existingVehicle.getCapacity()));
        }
        if (vehicle.getOdometer() != null) {
            existingVehicle.setOdometer(parseDoubleValue(vehicle.getOdometer(), existingVehicle.getOdometer()));
        }
        if (vehicle.getCost() != null) {
            existingVehicle.setCost(parseDoubleValue(vehicle.getCost(), existingVehicle.getCost()));
        }
        if (vehicle.getStatus() != null) {
            existingVehicle.setStatus(vehicle.getStatus());
        }

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