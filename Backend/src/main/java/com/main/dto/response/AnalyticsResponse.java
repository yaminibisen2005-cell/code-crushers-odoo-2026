package com.main.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AnalyticsResponse {

    private double totalFuelCost;
    private double totalExpenses;
    private double maintenanceCost;
    private double operationalCost;
    private double totalFuelUsed;
    private double fuelEfficiency;
}