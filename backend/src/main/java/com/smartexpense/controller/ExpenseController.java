package com.smartexpense.controller;

import com.smartexpense.dto.DashboardResponse;
import com.smartexpense.dto.ExpenseRequest;
import com.smartexpense.dto.ExpenseResponse;
import com.smartexpense.service.BudgetService;
import com.smartexpense.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final BudgetService budgetService;

    public ExpenseController(ExpenseService expenseService, BudgetService budgetService) {
        this.expenseService = expenseService;
        this.budgetService = budgetService;
    }

    // POST /api/expenses
    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.addExpense(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/expenses/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseResponse>> getExpenses(@PathVariable Long userId) {
        return ResponseEntity.ok(expenseService.getExpensesByUser(userId));
    }

    // DELETE /api/expenses/{expenseId}
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok("Expense deleted successfully.");
    }

    // GET /api/expenses/dashboard/{userId}
    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable Long userId) {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        double totalExpenses   = expenseService.getTotalExpenses(userId);
        double todayExpenses   = expenseService.getTodayExpenses(userId);
        double spentThisMonth  = expenseService.getMonthlyExpenses(userId, month, year);
        double monthlyBudget   = budgetService.getBudgetAmount(userId, month, year);
        double budgetLeft      = monthlyBudget - spentThisMonth;
        boolean exceeded       = monthlyBudget > 0 && spentThisMonth > monthlyBudget;
        List<ExpenseResponse> recent = expenseService.getTop5RecentExpenses(userId);

        DashboardResponse dashboard = new DashboardResponse();
        dashboard.setTotalExpenses(totalExpenses);
        dashboard.setTodayExpenses(todayExpenses);
        dashboard.setMonthlyBudget(monthlyBudget);
        dashboard.setSpentThisMonth(spentThisMonth);
        dashboard.setBudgetLeft(budgetLeft);
        dashboard.setBudgetExceeded(exceeded);
        dashboard.setRecentExpenses(recent);

        return ResponseEntity.ok(dashboard);
    }
}
