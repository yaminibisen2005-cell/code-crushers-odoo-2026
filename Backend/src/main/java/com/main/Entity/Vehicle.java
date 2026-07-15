package com.main.Entity;

import com.main.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double capacity;

    @Column(nullable = false)
    private Double odometer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;
}