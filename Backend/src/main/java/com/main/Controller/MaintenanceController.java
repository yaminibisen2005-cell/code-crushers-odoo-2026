package com.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Entity.Maintenance;
import com.main.Service.MaintenanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/vehicle/{vehicleId}")
    public ResponseEntity<Maintenance> createMaintenance(
            @PathVariable Long vehicleId,
            @RequestBody Maintenance maintenance) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(maintenanceService.createMaintenance(
                        vehicleId, maintenance));
    }

    @GetMapping
    public List<Maintenance> getAllMaintenance() {
        return maintenanceService.getAllMaintenance();
    }

    @GetMapping("/{id}")
    public Maintenance getMaintenanceById(
            @PathVariable Long id) {

        return maintenanceService.getMaintenanceById(id);
    }

    @PatchMapping("/{id}/complete")
    public Maintenance completeMaintenance(
            @PathVariable Long id) {

        return maintenanceService.completeMaintenance(id);
    }
}