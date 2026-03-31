package com.smartexpense.service;

import com.smartexpense.dto.BudgetRequest;
import com.smartexpense.dto.BudgetResponse;
import com.smartexpense.entity.Budget;
import com.smartexpense.entity.User;
import com.smartexpense.exception.BadRequestException;
import com.smartexpense.exception.ResourceNotFoundException;
import com.smartexpense.repository.BudgetRepository;
import com.smartexpense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    public BudgetResponse saveOrUpdateBudget(BudgetRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0)
            throw new BadRequestException("Budget amount must be greater than 0.");
        if (request.getMonth() == null || request.getMonth() < 1 || request.getMonth() > 12)
            throw new BadRequestException("Invalid month.");
        if (request.getYear() == null || request.getYear() < 2000)
            throw new BadRequestException("Invalid year.");
        if (request.getUserId() == null)
            throw new BadRequestException("User ID is required.");

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        // If budget already exists for this month/year, update it
        Optional<Budget> existing = budgetRepository.findByUserIdAndMonthAndYear(
                request.getUserId(), request.getMonth(), request.getYear());

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setAmount(request.getAmount());
        } else {
            budget = new Budget();
            budget.setAmount(request.getAmount());
            budget.setMonth(request.getMonth());
            budget.setYear(request.getYear());
            budget.setUser(user);
        }

        Budget saved = budgetRepository.save(budget);
        return new BudgetResponse(saved.getId(), saved.getAmount(),
                saved.getMonth(), saved.getYear(), saved.getUser().getId());
    }

    public BudgetResponse getBudget(Long userId, Integer month, Integer year) {
        Optional<Budget> budget = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        if (budget.isEmpty()) {
            // Return 0 budget if none set
            return new BudgetResponse(null, 0.0, month, year, userId);
        }
        Budget b = budget.get();
        return new BudgetResponse(b.getId(), b.getAmount(), b.getMonth(), b.getYear(), b.getUser().getId());
    }

    public Double getBudgetAmount(Long userId, Integer month, Integer year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .map(Budget::getAmount)
                .orElse(0.0);
    }
}
