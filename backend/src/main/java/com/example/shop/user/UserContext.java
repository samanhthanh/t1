package com.example.shop.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserContext {
  private final UserRepository userRepository;

  public UserContext(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User currentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || auth.getName() == null) {
      throw new IllegalStateException("No authenticated user");
    }
    return userRepository.findByEmail(auth.getName()).orElseThrow();
  }
}
