package com.smartexpense.service;

import com.smartexpense.dto.ExpenseRequest;
import com.smartexpense.dto.ExpenseResponse;
import com.smartexpense.entity.Expense;
import com.smartexpense.entity.User;
import com.smartexpense.exception.BadRequestException;
import com.smartexpense.exception.ResourceNotFoundException;
import com.smartexpense.repository.ExpenseRepository;
import com.smartexpense.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    public ExpenseResponse addExpense(ExpenseRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank())
            throw new BadRequestException("Expense title is required.");
        if (request.getAmount() == null || request.getAmount() <= 0)
            throw new BadRequestException("Expense amount must be greater than 0.");
        if (request.getCategory() == null || request.getCategory().isBlank())
            throw new BadRequestException("Category is required.");
        if (request.getDate() == null)
            throw new BadRequestException("Date is required.");
        if (request.getUserId() == null)
            throw new BadRequestException("User ID is required.");

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setUser(user);

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return expenseRepository.findByUserIdOrderByDateDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + expenseId));
        expenseRepository.delete(expense);
    }

    public List<ExpenseResponse> getTop5RecentExpenses(Long userId) {
        return expenseRepository.findTop5ByUserIdOrderByDateDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Double getTotalExpenses(Long userId) {
        Double total = expenseRepository.sumAmountByUserId(userId);
        return total != null ? total : 0.0;
    }

    public Double getTodayExpenses(Long userId) {
        Double today = expenseRepository.sumAmountByUserIdAndDate(userId, LocalDate.now());
        return today != null ? today : 0.0;
    }

    public Double getMonthlyExpenses(Long userId, int month, int year) {
        Double monthly = expenseRepository.sumMonthlyByUserId(userId, month, year);
        return monthly != null ? monthly : 0.0;
    }

    public List<ExpenseResponse> getMonthlyExpenseList(Long userId, int month, int year) {
        return expenseRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Helper
    public ExpenseResponse toResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getDate(),
                expense.getUser().getId()
        );
    }
}
