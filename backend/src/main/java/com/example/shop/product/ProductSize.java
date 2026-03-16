package com.example.shop.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "product_sizes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "size"})
})
public class ProductSize {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id", nullable = false)
  @JsonIgnoreProperties({"images", "sizes"})
  private Product product;

  @Column(nullable = false)
  private String size;

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

  public String getSize() {
    return size;
  }

  public void setSize(String size) {
    this.size = size;
  }

  public int getQuantity() {
    return quantity;
  }

  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}
