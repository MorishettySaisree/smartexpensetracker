package com.smartexpense.service;

import com.smartexpense.dto.ExpenseResponse;
import com.smartexpense.dto.MonthlyReportResponse;
import com.smartexpense.entity.Expense;
import com.smartexpense.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final BudgetService budgetService;
    private final ExpenseService expenseService;

    public ReportService(ExpenseRepository expenseRepository,
                         BudgetService budgetService,
                         ExpenseService expenseService) {
        this.expenseRepository = expenseRepository;
        this.budgetService = budgetService;
        this.expenseService = expenseService;
    }

    public MonthlyReportResponse getMonthlyReport(Long userId, int month, int year) {
        List<Expense> expenses = expenseRepository.findByUserIdAndMonthAndYear(userId, month, year);

        // Total spent
        double totalSpent = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        // Category totals
        Map<String, Double> categoryTotals = new LinkedHashMap<>();
        for (Expense e : expenses) {
            categoryTotals.merge(e.getCategory(), e.getAmount(), Double::sum);
        }

        // Category percentages
        Map<String, Double> categoryPercentages = new LinkedHashMap<>();
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            double pct = totalSpent > 0 ? (entry.getValue() / totalSpent) * 100 : 0;
            categoryPercentages.put(entry.getKey(), Math.round(pct * 100.0) / 100.0);
        }

        // Budget
        double budget = budgetService.getBudgetAmount(userId, month, year);
        double remaining = budget - totalSpent;
        boolean exceeded = totalSpent > budget && budget > 0;

        // Expense list
        List<ExpenseResponse> expenseResponses = expenses.stream()
                .map(expenseService::toResponse)
                .collect(Collectors.toList());

        MonthlyReportResponse report = new MonthlyReportResponse();
        report.setMonth(month);
        report.setYear(year);
        report.setTotalSpent(totalSpent);
        report.setMonthlyBudget(budget);
        report.setRemainingBudget(remaining);
        report.setBudgetExceeded(exceeded);
        report.setCategoryTotals(categoryTotals);
        report.setCategoryPercentages(categoryPercentages);
        report.setExpenses(expenseResponses);

        return report;
    }
}
