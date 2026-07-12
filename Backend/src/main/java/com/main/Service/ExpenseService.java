package com.main.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.main.Entity.Expense;
import com.main.Entity.Trip;
import com.main.Entity.Vehicle;
import com.main.exception.BusinessException;
import com.main.Repository.ExpenseRepository;
import com.main.Repository.TripRepository;
import com.main.Repository.VehicleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public Expense addExpense(
            Long vehicleId,
            Long tripId,
            Expense expense) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new BusinessException("Vehicle not found"));

        expense.setVehicle(vehicle);

        if (tripId != null) {

            Trip trip = tripRepository.findById(tripId)
                    .orElseThrow(() ->
                            new BusinessException("Trip not found"));

            expense.setTrip(trip);
        }

        if (expense.getAmount() == null
                || expense.getAmount() <= 0) {
            throw new BusinessException(
                    "Expense amount must be greater than zero");
        }

        if (expense.getDate() == null) {
            expense.setDate(LocalDate.now());
        }

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public void deleteExpense(Long id) {

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Expense not found"));

        expenseRepository.delete(expense);
    }
}