package com.smartexpense.dto;

import java.time.LocalDate;

public class ExpenseResponse {
    private Long id;
    private String title;
    private Double amount;
    private String category;
    private String description;
    private LocalDate date;
    private Long userId;

    public ExpenseResponse() {}

    public ExpenseResponse(Long id, String title, Double amount, String category,
                           String description, LocalDate date, Long userId) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.date = date;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
