package com.main.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.Entity.Vehicle;
import com.main.enums.VehicleStatus;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    boolean existsByRegistrationNumber(String registrationNumber);

    List<Vehicle> findByStatus(VehicleStatus status);
}