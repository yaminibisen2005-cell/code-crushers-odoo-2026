package com.main.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.main.Entity.Expense;
import com.main.Service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping("/vehicle/{vehicleId}")
    public ResponseEntity<Expense> addExpense(
            @PathVariable Long vehicleId,
            @RequestParam(required = false) Long tripId,
            @RequestBody Expense expense) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(expenseService.addExpense(
                        vehicleId, tripId, expense));
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.ok(
                "Expense deleted successfully");
    }
}