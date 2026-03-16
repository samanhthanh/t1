package com.example.shop.cart;

import com.example.shop.product.Product;
import com.example.shop.product.ProductRepository;
import com.example.shop.user.User;
import com.example.shop.user.UserContext;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CartService {
  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductRepository productRepository;
  private final UserContext userContext;

  public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                     ProductRepository productRepository, UserContext userContext) {
    this.cartRepository = cartRepository;
    this.cartItemRepository = cartItemRepository;
    this.productRepository = productRepository;
    this.userContext = userContext;
  }

  @Transactional
  public Cart getOrCreateActiveCart() {
    User user = userContext.currentUser();
    return cartRepository.findByUserIdAndStatus(user.getId(), CartStatus.ACTIVE)
        .orElseGet(() -> {
          Cart cart = new Cart();
          cart.setUser(user);
          return cartRepository.save(cart);
        });
  }

  @Transactional
  public Cart addItem(Long productId, int quantity) {
    Cart cart = getOrCreateActiveCart();
    Product product = productRepository.findById(productId).orElseThrow();
    CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
        .orElseGet(() -> {
          CartItem newItem = new CartItem();
          newItem.setCart(cart);
          newItem.setProduct(product);
          newItem.setQuantity(0);
          newItem.setPriceAtAdd(product.getPrice());
          return newItem;
        });
    item.setQuantity(item.getQuantity() + quantity);
    cartItemRepository.save(item);
    return cart;
  }

  @Transactional
  public Cart updateItem(Long productId, int quantity) {
    Cart cart = getOrCreateActiveCart();
    CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId).orElseThrow();
    if (quantity <= 0) {
      cartItemRepository.delete(item);
    } else {
      item.setQuantity(quantity);
      cartItemRepository.save(item);
    }
    return cart;
  }

  @Transactional
  public List<CartItem> listItems() {
    Cart cart = getOrCreateActiveCart();
    return cart.getItems();
  }
}
