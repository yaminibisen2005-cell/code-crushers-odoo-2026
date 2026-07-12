package com.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Entity.FuelLog;
import com.main.Service.FuelLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fuel")
@RequiredArgsConstructor
public class FuelLogController {

    private final FuelLogService fuelLogService;

    @PostMapping("/vehicle/{vehicleId}")
    public ResponseEntity<FuelLog> addFuelLog(
            @PathVariable Long vehicleId,
            @RequestParam(required = false) Long tripId,
            @RequestBody FuelLog fuelLog) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(fuelLogService.addFuelLog(
                        vehicleId, tripId, fuelLog));
    }

    @GetMapping
    public List<FuelLog> getAllFuelLogs() {
        return fuelLogService.getAllFuelLogs();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFuelLog(
            @PathVariable Long id) {

        fuelLogService.deleteFuelLog(id);

        return ResponseEntity.ok(
                "Fuel log deleted successfully");
    }
}