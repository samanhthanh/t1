package com.example.shop.product;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
  Optional<InventoryItem> findByProductId(Long productId);
}
