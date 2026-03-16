package com.example.shop.product;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByActiveTrue();
  long countByTypeIgnoreCase(String type);

  @Query("select p from Product p " +
      "where p.active = true " +
      "and (lower(p.name) like lower(concat('%', :q, '%')) " +
      "or lower(p.description) like lower(concat('%', :q, '%')))")
  List<Product> searchActiveByQuery(@Param("q") String query);
}
