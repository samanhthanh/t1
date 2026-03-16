package com.example.shop.product;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class InventoryItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  private Product product;

  @Column(nullable = false)
  private int quantity;

  public Long getId() {
    return id;
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
}
