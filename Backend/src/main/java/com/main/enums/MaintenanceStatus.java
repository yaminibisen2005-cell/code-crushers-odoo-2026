package com.main.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MaintenanceStatus {
    ACTIVE,
    COMPLETED;

    @JsonCreator
    public static MaintenanceStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return ACTIVE;
        }

        String normalized = value.trim().toUpperCase().replace(' ', '_');
        return switch (normalized) {
            case "PENDING", "IN_PROGRESS", "IN-PROGRESS", "ACTIVE" -> ACTIVE;
            case "COMPLETED", "DONE" -> COMPLETED;
            default -> throw new IllegalArgumentException("Unknown maintenance status: " + value);
        };
    }

    @JsonValue
    public String toJson() {
        return name();
    }
}