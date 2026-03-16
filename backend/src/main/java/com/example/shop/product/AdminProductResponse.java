package com.example.shop.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class AdminProductResponse {
  private final Long id;
  private final String name;
  private final String description;
  private final BigDecimal price;
  private final String size;
  private final String type;
  private final String imageUrl;
  private final boolean active;
  private final Instant createdAt;
  private final int quantity;
  private final List<ProductSize> sizes;

  public AdminProductResponse(Product product, int quantity) {
    this.id = product.getId();
    this.name = product.getName();
    this.description = product.getDescription();
    this.price = product.getPrice();
    this.size = product.getSize();
    this.type = product.getType();
    this.imageUrl = product.getImageUrl();
    this.active = product.isActive();
    this.createdAt = product.getCreatedAt();
    this.quantity = quantity;
    this.sizes = product.getSizes();
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public String getSize() {
    return size;
  }

  public String getType() {
    return type;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public boolean isActive() {
    return active;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public int getQuantity() {
    return quantity;
  }

  public List<ProductSize> getSizes() {
    return sizes;
  }
}
