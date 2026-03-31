package com.smartexpense.dto;

import java.util.Map;
import java.util.List;

public class MonthlyReportResponse {
    private Integer month;
    private Integer year;
    private Double totalSpent;
    private Double monthlyBudget;
    private Double remainingBudget;
    private boolean budgetExceeded;
    private Map<String, Double> categoryTotals;
    private Map<String, Double> categoryPercentages;
    private List<ExpenseResponse> expenses;

    public MonthlyReportResponse() {}

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public Double getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(Double monthlyBudget) { this.monthlyBudget = monthlyBudget; }

    public Double getRemainingBudget() { return remainingBudget; }
    public void setRemainingBudget(Double remainingBudget) { this.remainingBudget = remainingBudget; }

    public boolean isBudgetExceeded() { return budgetExceeded; }
    public void setBudgetExceeded(boolean budgetExceeded) { this.budgetExceeded = budgetExceeded; }

    public Map<String, Double> getCategoryTotals() { return categoryTotals; }
    public void setCategoryTotals(Map<String, Double> categoryTotals) { this.categoryTotals = categoryTotals; }

    public Map<String, Double> getCategoryPercentages() { return categoryPercentages; }
    public void setCategoryPercentages(Map<String, Double> categoryPercentages) { this.categoryPercentages = categoryPercentages; }

    public List<ExpenseResponse> getExpenses() { return expenses; }
    public void setExpenses(List<ExpenseResponse> expenses) { this.expenses = expenses; }
}
