package com.main.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.main.Entity.Driver;
import com.main.enums.DriverStatus;
import com.main.exception.BusinessException;
import com.main.Repository.DriverRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Driver addDriver(Driver driver) {

        if (driverRepository.existsByLicenseNumber(
                driver.getLicenseNumber())) {
            throw new BusinessException(
                    "Driver license number already exists");
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessException(
                    "Driver license is already expired");
        }

        driver.setStatus(DriverStatus.AVAILABLE);

        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Driver not found"));
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository
                .findByStatus(DriverStatus.AVAILABLE);
    }

    public Driver updateDriver(Long id, Driver driver) {

        Driver existingDriver = getDriverById(id);

        existingDriver.setName(driver.getName());
        existingDriver.setLicenseNumber(driver.getLicenseNumber());
        existingDriver.setLicenseExpiryDate(
                driver.getLicenseExpiryDate());
        existingDriver.setPhone(driver.getPhone());
        existingDriver.setSafetyScore(driver.getSafetyScore());

        return driverRepository.save(existingDriver);
    }

    public void deleteDriver(Long id) {

        Driver driver = getDriverById(id);

        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessException(
                    "Driver on active trip cannot be deleted");
        }

        driverRepository.delete(driver);
    }

    public Driver changeStatus(Long id, DriverStatus status) {

        Driver driver = getDriverById(id);

        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessException(
                    "Cannot change status while driver is on trip");
        }

        driver.setStatus(status);

        return driverRepository.save(driver);
    }
}