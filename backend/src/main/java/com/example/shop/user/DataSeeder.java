package com.example.shop.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
  private final UserService userService;
  private final String adminEmail;
  private final String adminPassword;

  public DataSeeder(UserService userService,
                    @Value("${app.seed.admin-email:admin@shop.local}") String adminEmail,
                    @Value("${app.seed.admin-password:admin123}") String adminPassword) {
    this.userService = userService;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
  }

  @Override
  public void run(String... args) {
    userService.createAdminIfMissing(adminEmail, adminPassword);
  }
}
