package com.example.shop.user;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public User registerUser(String email, String password) {
    if (userRepository.existsByEmail(email)) {
      throw new IllegalArgumentException("Email already exists");
    }
    User user = new User();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(Role.USER);
    return userRepository.save(user);
  }

  @Transactional
  public User createAdminIfMissing(String email, String password) {
    return userRepository.findByEmail(email).orElseGet(() -> {
      User admin = new User();
      admin.setEmail(email);
      admin.setPasswordHash(passwordEncoder.encode(password));
      admin.setRole(Role.ADMIN);
      return userRepository.save(admin);
    });
  }

  public List<User> listUsers() {
    return userRepository.findAll();
  }

  @Transactional
  public User setEnabled(Long id, boolean enabled) {
    User user = userRepository.findById(id).orElseThrow();
    user.setEnabled(enabled);
    return userRepository.save(user);
  }
}
