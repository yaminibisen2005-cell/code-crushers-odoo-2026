package com.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Entity.Driver;
import com.main.enums.DriverStatus;
import com.main.Service.DriverService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<Driver> addDriver(
            @RequestBody Driver driver) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(driverService.addDriver(driver));
    }

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return driverService.getDriverById(id);
    }

    @GetMapping("/available")
    public List<Driver> getAvailableDrivers() {
        return driverService.getAvailableDrivers();
    }

    @PutMapping("/{id}")
    public Driver updateDriver(
            @PathVariable Long id,
            @RequestBody Driver driver) {

        return driverService.updateDriver(id, driver);
    }

    @PatchMapping("/{id}/status")
    public Driver changeStatus(
            @PathVariable Long id,
            @RequestParam DriverStatus status) {

        return driverService.changeStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDriver(
            @PathVariable Long id) {

        driverService.deleteDriver(id);

        return ResponseEntity.ok(
                "Driver deleted successfully");
    }
}