package com.example.shop.product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductCreateRequest {
  private String name;
  private String description;
  private BigDecimal price;
  private String type;
  private boolean active = true;
  private List<ProductSizeRequest> sizes = new ArrayList<>();

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

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public List<ProductSizeRequest> getSizes() {
    return sizes;
  }

  public void setSizes(List<ProductSizeRequest> sizes) {
    this.sizes = sizes;
  }
}
