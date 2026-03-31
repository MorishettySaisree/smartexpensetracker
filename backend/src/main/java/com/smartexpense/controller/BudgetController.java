package com.smartexpense.controller;

import com.smartexpense.dto.BudgetRequest;
import com.smartexpense.dto.BudgetResponse;
import com.smartexpense.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // POST /api/budgets
    @PostMapping
    public ResponseEntity<BudgetResponse> saveOrUpdateBudget(@RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.saveOrUpdateBudget(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/budgets?userId=1&month=6&year=2025
    @GetMapping
    public ResponseEntity<BudgetResponse> getBudget(
            @RequestParam Long userId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        BudgetResponse response = budgetService.getBudget(userId, month, year);
        return ResponseEntity.ok(response);
    }
}
