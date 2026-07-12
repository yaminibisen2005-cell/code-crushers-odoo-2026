package com.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.dto.request.TripRequest;
import com.main.Entity.Trip;
import com.main.Service.TripService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<Trip> createTrip(
            @RequestBody TripRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(tripService.createTrip(request));
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    @PatchMapping("/{id}/dispatch")
    public Trip dispatchTrip(@PathVariable Long id) {
        return tripService.dispatchTrip(id);
    }

    @PatchMapping("/{id}/complete")
    public Trip completeTrip(@PathVariable Long id) {
        return tripService.completeTrip(id);
    }

    @PatchMapping("/{id}/cancel")
    public Trip cancelTrip(@PathVariable Long id) {
        return tripService.cancelTrip(id);
    }
}