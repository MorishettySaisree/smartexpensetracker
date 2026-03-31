package com.smartexpense.dto;

public class BudgetResponse {
    private Long id;
    private Double amount;
    private Integer month;
    private Integer year;
    private Long userId;

    public BudgetResponse() {}

    public BudgetResponse(Long id, Double amount, Integer month, Integer year, Long userId) {
        this.id = id;
        this.amount = amount;
        this.month = month;
        this.year = year;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
