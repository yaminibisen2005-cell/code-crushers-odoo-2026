package com.main.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.main.dto.request.TripRequest;
import com.main.Entity.Driver;
import com.main.Entity.Trip;
import com.main.Entity.Vehicle;
import com.main.enums.DriverStatus;
import com.main.enums.TripStatus;
import com.main.enums.VehicleStatus;
import com.main.exception.BusinessException;
import com.main.Repository.DriverRepository;
import com.main.Repository.TripRepository;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public Trip createTrip(TripRequest request) {

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() ->
                        new BusinessException("Vehicle not found"));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() ->
                        new BusinessException("Driver not found"));

        validateTrip(vehicle, driver, request.getCargoWeight());

        Trip trip = Trip.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeight(request.getCargoWeight())
                .distance(request.getDistance())
                .status(TripStatus.DRAFT)
                .build();

        return tripRepository.save(trip);
    }

    private void validateTrip(
            Vehicle vehicle,
            Driver driver,
            Double cargoWeight) {

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessException(
                    "Vehicle is not available");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessException(
                    "Driver is not available");
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessException(
                    "Driver license has expired");
        }

        if (cargoWeight > vehicle.getCapacity()) {
            throw new BusinessException(
                    "Cargo weight exceeds vehicle capacity");
        }
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Trip not found"));
    }

    @Transactional
    public Trip dispatchTrip(Long id) {

        Trip trip = getTripById(id);

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessException(
                    "Only draft trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        validateTrip(
                vehicle,
                driver,
                trip.getCargoWeight());

        trip.setStatus(TripStatus.DISPATCHED);
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip completeTrip(Long id) {

        Trip trip = getTripById(id);

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessException(
                    "Only dispatched trips can be completed");
        }

        trip.setStatus(TripStatus.COMPLETED);

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        vehicle.setStatus(VehicleStatus.AVAILABLE);
        driver.setStatus(DriverStatus.AVAILABLE);

        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancelTrip(Long id) {

        Trip trip = getTripById(id);

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new BusinessException(
                    "Completed trip cannot be cancelled");
        }

        if (trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessException(
                    "Trip is already cancelled");
        }

        if (trip.getStatus() == TripStatus.DISPATCHED) {

            trip.getVehicle()
                    .setStatus(VehicleStatus.AVAILABLE);

            trip.getDriver()
                    .setStatus(DriverStatus.AVAILABLE);

            vehicleRepository.save(trip.getVehicle());
            driverRepository.save(trip.getDriver());
        }

        trip.setStatus(TripStatus.CANCELLED);

        return tripRepository.save(trip);
    }
}