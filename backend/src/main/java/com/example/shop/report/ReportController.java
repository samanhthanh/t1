package com.example.shop.report;

import com.example.shop.user.UserRepository;
import java.time.*;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {
  private final UserRepository userRepository;

  public ReportController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/daily")
  public Map<String, Object> daily(@RequestParam(value = "date", required = false) String dateStr) {
    LocalDate date = dateStr == null ? LocalDate.now() : LocalDate.parse(dateStr);
    Instant start = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant end = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    long users = userRepository.countByCreatedAtBetween(start, end);
    return Map.of("date", date.toString(), "newUsers", users);
  }

  @GetMapping("/weekly")
  public Map<String, Object> weekly(@RequestParam(value = "date", required = false) String dateStr) {
    LocalDate date = dateStr == null ? LocalDate.now() : LocalDate.parse(dateStr);
    LocalDate startDate = date.with(DayOfWeek.MONDAY);
    Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant end = startDate.plusWeeks(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    long users = userRepository.countByCreatedAtBetween(start, end);
    return Map.of("weekStart", startDate.toString(), "newUsers", users);
  }

  @GetMapping("/monthly")
  public Map<String, Object> monthly(@RequestParam(value = "date", required = false) String dateStr) {
    LocalDate date = dateStr == null ? LocalDate.now() : LocalDate.parse(dateStr);
    LocalDate startDate = date.withDayOfMonth(1);
    Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant end = startDate.plusMonths(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    long users = userRepository.countByCreatedAtBetween(start, end);
    return Map.of("month", startDate.getMonthValue(), "year", startDate.getYear(), "newUsers", users);
  }

  @GetMapping("/yearly")
  public Map<String, Object> yearly(@RequestParam(value = "year", required = false) Integer year) {
    int y = year == null ? LocalDate.now().getYear() : year;
    LocalDate startDate = LocalDate.of(y, 1, 1);
    Instant start = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant end = startDate.plusYears(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
    long users = userRepository.countByCreatedAtBetween(start, end);
    return Map.of("year", y, "newUsers", users);
  }
}
