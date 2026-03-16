package com.example.shop.cart;

import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {
  private final CartService cartService;

  public CartController(CartService cartService) {
    this.cartService = cartService;
  }

  @GetMapping
  public List<CartItem> listItems() {
    return cartService.listItems();
  }

  @PostMapping("/items")
  public Cart addItem(@RequestBody CartItemRequest request) {
    return cartService.addItem(request.getProductId(), request.getQuantity());
  }

  @PutMapping("/items")
  public Cart updateItem(@RequestBody CartItemRequest request) {
    return cartService.updateItem(request.getProductId(), request.getQuantity());
  }
}
