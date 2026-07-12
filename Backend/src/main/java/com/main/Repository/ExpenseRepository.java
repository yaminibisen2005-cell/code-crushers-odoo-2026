package com.main.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.main.Entity.Expense;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {
}