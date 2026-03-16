package com.example.shop.auth;

import com.example.shop.config.JwtUtil;
import com.example.shop.user.Role;
import com.example.shop.user.User;
import com.example.shop.user.UserRepository;
import com.example.shop.user.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;
  private final UserService userService;
  private final UserRepository userRepository;

  public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService,
                        UserRepository userRepository) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
    this.userService = userService;
    this.userRepository = userRepository;
  }

  @PostMapping("/register")
  public AuthResponse register(@RequestBody RegisterRequest request) {
    User user = userService.registerUser(request.getEmail(), request.getPassword());
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(token, user.getRole().name());
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody AuthRequest request) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
    User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    return new AuthResponse(token, user.getRole().name());
  }
}
