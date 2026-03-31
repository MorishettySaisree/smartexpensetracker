package com.smartexpense.controller;

import com.smartexpense.dto.MonthlyReportResponse;
import com.smartexpense.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // GET /api/reports/monthly?userId=1&month=6&year=2025
    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportResponse> getMonthlyReport(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year) {
        MonthlyReportResponse report = reportService.getMonthlyReport(userId, month, year);
        return ResponseEntity.ok(report);
    }
}
