package com.main.Service;

import org.springframework.stereotype.Service;

import com.main.dto.response.AnalyticsResponse;
import com.main.Repository.ExpenseRepository;
import com.main.Repository.FuelLogRepository;
import com.main.Repository.MaintenanceRepository;
import com.main.Repository.TripRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final TripRepository tripRepository;

    public AnalyticsResponse getAnalytics() {

        double totalFuelCost = fuelLogRepository.findAll()
                .stream()
                .mapToDouble(fuel ->
                        fuel.getCost() == null ? 0 : fuel.getCost())
                .sum();

        double totalFuelUsed = fuelLogRepository.findAll()
                .stream()
                .mapToDouble(fuel ->
                        fuel.getLiters() == null ? 0 : fuel.getLiters())
                .sum();

        double totalExpenses = expenseRepository.findAll()
                .stream()
                .mapToDouble(expense ->
                        expense.getAmount() == null
                                ? 0
                                : expense.getAmount())
                .sum();

        double maintenanceCost = maintenanceRepository.findAll()
                .stream()
                .mapToDouble(maintenance ->
                        maintenance.getCost() == null
                                ? 0
                                : maintenance.getCost())
                .sum();

        double totalDistance = tripRepository.findAll()
                .stream()
                .mapToDouble(trip ->
                        trip.getDistance() == null
                                ? 0
                                : trip.getDistance())
                .sum();

        double operationalCost =
                totalFuelCost + totalExpenses + maintenanceCost;

        double fuelEfficiency = 0;

        if (totalFuelUsed > 0) {
            fuelEfficiency = totalDistance / totalFuelUsed;
        }

        return AnalyticsResponse.builder()
                .totalFuelCost(totalFuelCost)
                .totalExpenses(totalExpenses)
                .maintenanceCost(maintenanceCost)
                .operationalCost(operationalCost)
                .totalFuelUsed(totalFuelUsed)
                .fuelEfficiency(fuelEfficiency)
                .build();
    }
}