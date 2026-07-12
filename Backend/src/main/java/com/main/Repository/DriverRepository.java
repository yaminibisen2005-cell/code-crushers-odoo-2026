package com.main.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.Entity.Driver;
import com.main.enums.DriverStatus;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    boolean existsByLicenseNumber(String licenseNumber);

    List<Driver> findByStatus(DriverStatus status);
}