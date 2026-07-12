package com.main.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.Entity.Trip;
import com.main.enums.TripStatus;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByStatus(TripStatus status);

    long countByStatus(TripStatus status);
}