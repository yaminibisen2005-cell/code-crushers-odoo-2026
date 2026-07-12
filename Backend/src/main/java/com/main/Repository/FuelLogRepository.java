package com.main.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.Entity.FuelLog;

public interface FuelLogRepository
        extends JpaRepository<FuelLog, Long> {
}