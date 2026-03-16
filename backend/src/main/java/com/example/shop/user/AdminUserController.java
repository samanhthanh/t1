package com.example.shop.user;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
  private final UserService userService;

  public AdminUserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public List<User> listUsers() {
    return userService.listUsers();
  }

  @PatchMapping("/{id}/enabled")
  public User setEnabled(@PathVariable("id") Long id, @RequestParam("enabled") boolean enabled) {
    return userService.setEnabled(id, enabled);
  }
}
