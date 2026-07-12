package com.main.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.main.Entity.FuelLog;
import com.main.Entity.Trip;
import com.main.Entity.Vehicle;
import com.main.exception.BusinessException;
import com.main.Repository.FuelLogRepository;
import com.main.Repository.TripRepository;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public FuelLog addFuelLog(
            Long vehicleId,
            Long tripId,
            FuelLog fuelLog) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new BusinessException("Vehicle not found"));

        fuelLog.setVehicle(vehicle);

        if (tripId != null) {
            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() ->
                            new BusinessException("Trip not found"));

            fuelLog.setTrip(trip);
        }

        if (fuelLog.getLiters() == null
                || fuelLog.getLiters() <= 0) {
            throw new BusinessException(
                    "Fuel liters must be greater than zero");
        }

        if (fuelLog.getCost() == null
                || fuelLog.getCost() < 0) {
            throw new BusinessException(
                    "Fuel cost is invalid");
        }

        if (fuelLog.getDate() == null) {
            fuelLog.setDate(LocalDate.now());
        }

        return fuelLogRepository.save(fuelLog);
    }

    public List<FuelLog> getAllFuelLogs() {
        return fuelLogRepository.findAll();
    }

    public void deleteFuelLog(Long id) {

        FuelLog fuelLog = fuelLogRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Fuel log not found"));

        fuelLogRepository.delete(fuelLog);
    }
}