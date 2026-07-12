package com.main.Entity;

import java.time.LocalDate;

import com.main.enums.DriverStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private LocalDate licenseExpiryDate;

    private String phone;

    private Double safetyScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;
}