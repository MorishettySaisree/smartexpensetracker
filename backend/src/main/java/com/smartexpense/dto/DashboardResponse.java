package com.smartexpense.dto;

import java.util.List;

public class DashboardResponse {
    private Double totalExpenses;
    private Double todayExpenses;
    private Double monthlyBudget;
    private Double spentThisMonth;
    private Double budgetLeft;
    private boolean budgetExceeded;
    private List<ExpenseResponse> recentExpenses;

    public DashboardResponse() {}

    public Double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Double totalExpenses) { this.totalExpenses = totalExpenses; }

    public Double getTodayExpenses() { return todayExpenses; }
    public void setTodayExpenses(Double todayExpenses) { this.todayExpenses = todayExpenses; }

    public Double getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(Double monthlyBudget) { this.monthlyBudget = monthlyBudget; }

    public Double getSpentThisMonth() { return spentThisMonth; }
    public void setSpentThisMonth(Double spentThisMonth) { this.spentThisMonth = spentThisMonth; }

    public Double getBudgetLeft() { return budgetLeft; }
    public void setBudgetLeft(Double budgetLeft) { this.budgetLeft = budgetLeft; }

    public boolean isBudgetExceeded() { return budgetExceeded; }
    public void setBudgetExceeded(boolean budgetExceeded) { this.budgetExceeded = budgetExceeded; }

    public List<ExpenseResponse> getRecentExpenses() { return recentExpenses; }
    public void setRecentExpenses(List<ExpenseResponse> recentExpenses) { this.recentExpenses = recentExpenses; }
}
