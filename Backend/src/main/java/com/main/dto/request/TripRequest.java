package com.main.dto.request;

import lombok.Data;

@Data
public class TripRequest {

    private String source;
    private String destination;
    private Long vehicleId;
    private Long driverId;
    private Double cargoWeight;
    private Double distance;
}