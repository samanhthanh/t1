package com.example.shop.product;

import java.math.BigDecimal;
import java.util.List;

public class ProductUpdateRequest {
  private String name;
  private String description;
  private BigDecimal price;
  private String type;
  private String imageUrl;
  private List<ProductSizeRequest> sizes;
  private boolean active = true;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public List<ProductSizeRequest> getSizes() {
    return sizes;
  }

  public void setSizes(List<ProductSizeRequest> sizes) {
    this.sizes = sizes;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }
}
