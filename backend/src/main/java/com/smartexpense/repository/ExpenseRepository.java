package com.smartexpense.repository;

import com.smartexpense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // All expenses for a user, newest first
    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    // Expenses for a specific user, month, and year
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId " +
           "AND MONTH(e.date) = :month AND YEAR(e.date) = :year " +
           "ORDER BY e.date DESC")
    List<Expense> findByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year);

    // Expenses for a user on a specific date
    List<Expense> findByUserIdAndDate(Long userId, LocalDate date);

    // Latest 5 expenses for dashboard
    List<Expense> findTop5ByUserIdOrderByDateDesc(Long userId);

    // Sum of all expenses for a user
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    Double sumAmountByUserId(@Param("userId") Long userId);

    // Sum of expenses for a user today
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId AND e.date = :today")
    Double sumAmountByUserIdAndDate(@Param("userId") Long userId, @Param("today") LocalDate today);

    // Sum of monthly expenses
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId " +
           "AND MONTH(e.date) = :month AND YEAR(e.date) = :year")
    Double sumMonthlyByUserId(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year);
}
