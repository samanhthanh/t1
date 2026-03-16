package com.example.shop.cart;

import com.example.shop.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JsonIgnoreProperties("items")
  private Cart cart;

  @ManyToOne(optional = false)
  private Product product;

  @Column(nullable = false)
  private int quantity;

  @Column(nullable = false)
  private BigDecimal priceAtAdd;

  public Long getId() {
    return id;
  }

  public Cart getCart() {
    return cart;
  }

  public void setCart(Cart cart) {
    this.cart = cart;
  }

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  public BigDecimal getPriceAtAdd() {
    return priceAtAdd;
  }

  public void setPriceAtAdd(BigDecimal priceAtAdd) {
    this.priceAtAdd = priceAtAdd;
  }
}
