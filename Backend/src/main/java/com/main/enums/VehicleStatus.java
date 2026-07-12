package com.main.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VehicleStatus {
    AVAILABLE,
    ON_TRIP,
    IN_SHOP,
    RETIRED;

    @JsonCreator
    public static VehicleStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toUpperCase().replace(' ', '_');
        for (VehicleStatus status : values()) {
            if (status.name().equals(normalized)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unknown vehicle status: " + value);
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}